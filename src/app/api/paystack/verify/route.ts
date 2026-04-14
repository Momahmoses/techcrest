import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { reference, courseId } = await req.json();

    if (!reference || !courseId) {
      return NextResponse.json({ success: false, error: 'Missing reference or courseId' }, { status: 400 });
    }

    // 1. Verify with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!paystackRes.ok) {
      return NextResponse.json({ success: false, error: 'Paystack API error' }, { status: 502 });
    }

    const { data: txData } = await paystackRes.json();

    if (txData.status !== 'success') {
      return NextResponse.json({ success: false, error: 'Payment not successful' }, { status: 400 });
    }

    // 2. Get student ID from metadata
    const studentId: string = txData.metadata?.studentId ?? txData.customer?.email;
    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Cannot identify student' }, { status: 400 });
    }

    // 3. Get course title for denormalization
    const courseSnap = await adminDb.collection('courses').doc(courseId).get();
    const courseTitle = courseSnap.exists ? courseSnap.data()?.title : '';

    // 4. Check duplicate
    const existing = await adminDb.collection('transactions')
      .where('reference', '==', reference)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // 5. Get student name for denormalization
    const userSnap = await adminDb.collection('users').doc(studentId).get();
    const studentName = userSnap.exists ? userSnap.data()?.name : '';

    // 6. Store transaction
    await adminDb.collection('transactions').add({
      reference,
      amount:       txData.amount / 100, // kobo → naira
      studentId,
      studentName,
      courseId,
      courseTitle,
      status:        'success',
      paymentMethod: txData.channel,
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
    console.error('[paystack/verify]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
