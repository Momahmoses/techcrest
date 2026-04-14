'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, CreditCard } from 'lucide-react';
import type { Transaction } from '@/types';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(query(collection(db!, 'transactions'), orderBy('createdAt', 'desc')));
        setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Transaction));
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = transactions.filter(t =>
    t.reference?.toLowerCase().includes(search.toLowerCase()) ||
    t.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    t.courseTitle?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-navy-900">Transactions</h1>
        <p className="text-gray-500 mt-1 text-sm">
          <span className="font-bold text-navy-900">{transactions.length}</span> transactions ·{' '}
          Total revenue:{' '}
          <span className="font-extrabold text-emerald-600">{formatCurrency(totalRevenue)}</span>
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
        <Input
          placeholder="Search by reference, student, or course…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="h-11"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['Reference', 'Student', 'Course', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{tx.reference?.slice(0, 16)}…</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {(tx.studentName ?? '?')[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-navy-900 text-xs">{tx.studentName ?? tx.studentId?.slice(0, 12) ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs max-w-[160px] truncate">{tx.courseTitle ?? tx.courseId?.slice(0, 16) ?? '—'}</td>
                    <td className="px-5 py-4 font-extrabold text-navy-900">{formatCurrency(tx.amount)}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={tx.status === 'success' ? 'success' : tx.status === 'failed' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <CreditCard size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-bold text-gray-500 text-lg">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Payment activity will appear here once students enroll.</p>
        </div>
      )}
    </div>
  );
}
