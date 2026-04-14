'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '@/types';

interface AdminStats {
  students:     number;
  revenue:      number;
  courses:      number;
  newThisMonth: number;
}

export default function AdminDashboardPage() {
  const [stats,        setStats]        = useState<AdminStats>({ students: 0, revenue: 0, courses: 0, newThisMonth: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData,    setChartData]    = useState<{ month: string; revenue: number }[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersSnap, coursesSnap, txSnap] = await Promise.all([
          getDocs(collection(db!, 'users')),
          getDocs(collection(db!, 'courses')),
          getDocs(query(collection(db!, 'transactions'), orderBy('createdAt', 'desc'), limit(10))),
        ]);

        const allTx: Transaction[] = txSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Transaction);
        const totalRevenue = allTx
          .filter(t => t.status === 'success')
          .reduce((s, t) => s + t.amount, 0);

        const now = new Date();
        const newThisMonth = usersSnap.docs.filter(d => {
          const data = d.data();
          if (!data.createdAt?.toDate) return false;
          const created = data.createdAt.toDate() as Date;
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        setStats({ students: usersSnap.size, revenue: totalRevenue, courses: coursesSnap.size, newThisMonth });
        setTransactions(allTx);

        const months: { month: string; revenue: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const label = d.toLocaleString('default', { month: 'short' });
          const rev = allTx
            .filter(t => {
              if (t.status !== 'success') return false;
              const td = new Date(t.createdAt);
              return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
            })
            .reduce((s, t) => s + t.amount, 0);
          months.push({ month: label, revenue: rev });
        }
        setChartData(months);
      } catch {
        // Firebase not configured
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { icon: Users,      label: 'Total Students',    value: stats.students,                sub: `+${stats.newThisMonth} this month`, gradient: 'from-accent-400 to-accent-600',   change: '+12%' },
    { icon: DollarSign, label: 'Total Revenue',     value: formatCurrency(stats.revenue), sub: 'All time',                          gradient: 'from-emerald-400 to-teal-600',   change: '+8%' },
    { icon: BookOpen,   label: 'Courses Published', value: stats.courses,                 sub: 'Active catalog',                    gradient: 'from-purple-500 to-violet-600',  change: 'Live' },
    { icon: TrendingUp, label: 'New This Month',    value: stats.newThisMonth,            sub: 'New students',                      gradient: 'from-gold-400 to-amber-600',     change: 'MTD' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-navy-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Platform performance and recent activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                  {s.change}
                </span>
              </div>
              <p className="font-display font-extrabold text-2xl text-navy-900">
                {loading ? <span className="inline-block w-12 h-6 bg-gray-100 animate-pulse rounded" /> : s.value}
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-xl text-navy-900">Revenue</h2>
            <p className="text-sm text-gray-500">Last 6 months</p>
          </div>
          <div className="flex items-center gap-1.5 text-accent-600 text-xs font-bold">
            <ArrowUpRight size={14} />
            Trending up
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00b4d8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00b4d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                formatter={(v: number) => [formatCurrency(v), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00b4d8"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ fill: '#00b4d8', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
            No transaction data yet
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="font-display font-bold text-xl text-navy-900">Recent Transactions</h2>
        </div>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['Reference', 'Student', 'Course', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">{tx.reference?.slice(0, 16)}…</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {(tx.studentName ?? '?')[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-navy-900 text-xs">{tx.studentName ?? tx.studentId?.slice(0, 8) ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs max-w-[140px] truncate">{tx.courseTitle ?? tx.courseId?.slice(0, 12) ?? '—'}</td>
                    <td className="px-5 py-4 font-bold text-navy-900 text-sm">{formatCurrency(tx.amount)}</td>
                    <td className="px-5 py-4">
                      <Badge variant={tx.status === 'success' ? 'success' : tx.status === 'failed' ? 'danger' : 'warning'} size="sm">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <DollarSign size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm font-medium">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
