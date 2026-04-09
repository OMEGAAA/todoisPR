'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Phone, ChevronRight, MessageSquare } from 'lucide-react';
import { getMediaContacts } from '@/lib/db/index';
import Link from 'next/link';

export default function MediaPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { getMediaContacts(searchQuery || undefined).then(d => setContacts(d || [])).catch(() => {}).finally(() => setIsLoading(false)); }, [searchQuery]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="w-6 h-6 text-orange-500" /> メディア管理</h1><p className="text-sm text-slate-500 mt-1">メディア・記者情報の管理</p></div>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 max-w-md focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
        <Search className="w-4 h-4 text-slate-400" /><input type="text" placeholder="媒体名・担当者名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm outline-none w-full" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map(mc => (
          <div key={mc.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 card-hover">
            <div className="flex items-start justify-between mb-3"><div><h3 className="text-sm font-semibold text-slate-800">{mc.outlet_name}</h3><p className="text-xs text-slate-500 mt-0.5">{mc.contact_name}</p></div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Users className="w-5 h-5 text-orange-500" /></div></div>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-500"><Mail className="w-3.5 h-3.5 text-slate-400" /> {mc.email}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Phone className="w-3.5 h-3.5 text-slate-400" /> {mc.phone}</div></div>
            <div className="flex flex-wrap gap-1 mb-3">{(mc.genres || []).map((g: string) => <span key={g} className="text-[11px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{g}</span>)}</div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1 text-xs text-slate-400"><MessageSquare className="w-3.5 h-3.5" /> やり取り {(mc.history || []).length}件</div>
              <Link href={`/media/${mc.id}`} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5">詳細 <ChevronRight className="w-3 h-3" /></Link></div>
          </div>
        ))}
      </div>
      {contacts.length === 0 && <div className="text-center py-12 text-sm text-slate-400">メディア情報がありません</div>}
    </div>
  );
}
