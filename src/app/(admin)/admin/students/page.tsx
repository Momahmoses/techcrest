'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Search, Users } from 'lucide-react';
import type { User } from '@/types';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(query(collection(db!, 'users'), orderBy('createdAt', 'desc')));
        setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() }) as User));
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-navy-900">Manage Students</h1>
        <p className="text-gray-500 mt-1 text-sm">
          <span className="font-bold text-navy-900">{students.length}</span> registered users
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
        <Input
          placeholder="Search by name or email…"
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
                  {['Student', 'Email', 'Role', 'Courses', 'Joined', 'Status'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(student => {
                  const initials = student.name
                    ? student.name.split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase()
                    : 'U';
                  const isActive = (student.enrolledCourses?.length ?? 0) > 0;
                  return (
                    <tr key={student.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-bold shrink-0 group-hover:scale-105 transition-transform duration-200">
                            {initials}
                          </div>
                          <span className="font-semibold text-navy-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{student.email}</td>
                      <td className="px-5 py-4">
                        <Badge variant={student.role === 'admin' ? 'navy' : 'default'} size="sm">
                          {student.role ?? 'student'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-navy-900">{student.enrolledCourses?.length ?? 0}</span>
                        <span className="text-gray-400 text-xs ml-1">courses</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {student.createdAt ? formatDate(student.createdAt) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={isActive ? 'success' : 'default'} size="sm">
                          {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-bold text-gray-500 text-lg">No students found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
