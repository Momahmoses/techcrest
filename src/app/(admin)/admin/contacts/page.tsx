'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Search, MessageSquare, Mail, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import type { ContactSubmission } from '@/types';

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          query(collection(db!, 'contacts'), orderBy('createdAt', 'desc')),
        );
        setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ContactSubmission));
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = submissions.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.subject?.toLowerCase().includes(search.toLowerCase()),
  );

  const markRead = async (id: string) => {
    try {
      await updateDoc(doc(db!, 'contacts', id), { read: true });
      setSubmissions(ss => ss.map(s => s.id === id ? { ...s, read: true } : s));
    } catch {}
  };

  const handleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
    const sub = submissions.find(s => s.id === id);
    if (sub && !sub.read) markRead(id);
  };

  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-navy-900">Contact Messages</h1>
          <p className="text-gray-500 mt-1 text-sm">
            <span className="font-bold text-navy-900">{submissions.length}</span>{' '}
            message{submissions.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <> ·{' '}
                <span className="font-bold text-amber-600">{unreadCount} unread</span>
              </>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <Inbox size={12} />
            {unreadCount} new
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
        <Input
          placeholder="Search by name, email, or subject…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="h-11"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(sub => (
            <div
              key={sub.id}
              className={`bg-white rounded-2xl border shadow-card overflow-hidden transition-all duration-300 ${
                sub.read ? 'border-gray-100' : 'border-l-4 border-l-accent-500 border-t-gray-100 border-r-gray-100 border-b-gray-100'
              }`}
            >
              <button
                className="w-full text-left p-5"
                onClick={() => handleExpand(sub.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 transition-colors ${sub.read ? 'bg-gray-300' : 'bg-accent-500 animate-pulse'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-navy-900 text-sm">{sub.name}</p>
                        <span className="text-gray-400 text-xs">{sub.email}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate font-medium">{sub.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!sub.read && <Badge variant="warning" size="sm">Unread</Badge>}
                    <span className="text-xs text-gray-400">
                      {sub.createdAt ? formatDate(sub.createdAt as string) : '—'}
                    </span>
                    {expanded === sub.id
                      ? <ChevronUp size={15} className="text-gray-400" />
                      : <ChevronDown size={15} className="text-gray-400" />
                    }
                  </div>
                </div>
              </button>

              {expanded === sub.id && (
                <div className="px-5 pb-5 pt-0">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {sub.message}
                    </p>
                  </div>
                  <a
                    href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject)}`}
                    className="inline-flex items-center gap-2 mt-3 text-sm text-accent-600 font-bold hover:text-accent-500 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent-50 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                      <Mail size={13} className="text-accent-600" />
                    </div>
                    Reply via email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-bold text-gray-500 text-lg">No messages yet</p>
          <p className="text-sm text-gray-400 mt-1">Contact form submissions will appear here.</p>
        </div>
      )}
    </div>
  );
}
