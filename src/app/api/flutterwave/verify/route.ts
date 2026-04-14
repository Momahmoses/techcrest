import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { transactionId, courseId } = await req.json();

    if (!transactionId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing transactionId or courseId' },
        { status: 400 },
      );
    }

    // 1. Verify with Flutterwave
    const flwRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!flwRes.ok) {
      return NextResponse.json({ success: false, error: 'Flutterwave API error' }, { status: 502 });
    }

    const { status: apiStatus, data: txData } = await flwRes.json();

    if (apiStatus !== 'success' || (txData.status !== 'successful' && txData.status !== 'completed')) {
      return NextResponse.json({ success: false, error: 'Payment not successful' }, { status: 400 });
    }

    // 2. Get student ID from metadata
    const studentId: string = txData.meta?.studentId ?? txData.customer?.email;
    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Cannot identify student' }, { status: 400 });
    }

    // 3. Get course title for denormalization
    const courseSnap  = await adminDb.collection('courses').doc(courseId).get();
    const courseTitle = courseSnap.exists ? courseSnap.data()?.title : '';

    // 4. Check duplicate (idempotency guard on tx_ref)
    const existing = await adminDb
      .collection('transactions')
      .where('reference', '==', txData.tx_ref)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // 5. Get student name for denormalization
    const userSnap    = await adminDb.collection('users').doc(studentId).get();
    const studentName = userSnap.exists ? userSnap.data()?.name : '';

    // 6. Store transaction
    await adminDb.collection('transactions').add({
      reference:     txData.tx_ref,
      transactionId: String(transactionId),
      amount:        txData.amount,
      currency:      txData.currency,
      studentId,
      studentName,
      courseId,
      courseTitle,
      status:        'success',
      paymentMethod: txData.payment_type,
      provider:      'flutterwave',
      createdAt:     new Date().toISOString(),
    });

    // 7. Enroll student
    await adminDb.collection('users').doc(studentId).update({
      enrolledCourses: FieldValue.arrayUnion(courseId),
    });

    // 8. Bump course student count
    await adminDb.collection('courses').doc(courseId).update({
      students: FieldValue.increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[flutterwave/verify]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
