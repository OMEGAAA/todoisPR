'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, ChevronRight } from 'lucide-react';
import { getPressReleases } from '@/lib/db/index';
import { STATUS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function PressReleasesPage() {
  const [releases, setReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { getPressReleases(searchQuery || undefined).then(d => setReleases(d || [])).catch(() => {}).finally(() => setIsLoading(false)); }, [searchQuery]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-500" /> プレスリリース管理</h1><p className="text-sm text-slate-500 mt-1">プレスリリースの作成・管理</p></div>
        <Link href="/press-releases/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20"><Plus className="w-4 h-4" /> 新規作成</Link>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 max-w-md focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
        <Search className="w-4 h-4 text-slate-400" /><input type="text" placeholder="リリースを検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm outline-none w-full" /></div>
      <div className="space-y-4">
        {releases.length === 0 ? <div className="text-center py-12 text-sm text-slate-400">プレスリリースがありません</div> :
        releases.map(pr => (
          <Link key={pr.id} href={`/press-releases/${pr.id}`} className="block bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 card-hover">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[pr.status]}`}>{pr.status}</span><span className="text-xs text-slate-400">発表日: {pr.release_date ? formatDate(pr.release_date) : '-'}</span></div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">{pr.title}</h2>
                {pr.subtitle && <p className="text-sm text-slate-500 mb-2">{pr.subtitle}</p>}
                <p className="text-sm text-slate-600 line-clamp-2">{pr.summary}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>作成者: {pr.creator?.name || '-'}</span>
                  {pr.distribution_targets?.length > 0 && <span>配信先: {pr.distribution_targets.join(', ')}</span>}</div>
              </div><ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-2" /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
