'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, Plus, Search, List, LayoutGrid } from 'lucide-react';
import { getIdeas } from '@/lib/db/ideas';
import { STATUS_COLORS, PRIORITY_COLORS, IDEA_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadIdeas = useCallback(async () => {
    try {
      const data = await getIdeas({ status: statusFilter, search: searchQuery });
      setIdeas(data || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, [statusFilter, searchQuery]);

  useEffect(() => { loadIdeas(); }, [loadIdeas]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" /> 広報ネタ管理
          </h1>
          <p className="text-sm text-slate-500 mt-1">広報ネタの収集・管理</p>
        </div>
        <Link href="/ideas/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20">
          <Plus className="w-4 h-4" /> ネタ追加
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 flex-1 w-full sm:w-auto focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="ネタを検索..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none w-full" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
          <option value="all">すべてのステータス</option>
          {IDEA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('kanban')} className={`p-2.5 ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">タイトル</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden md:table-cell">投稿者</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ステータス</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden sm:table-cell">優先度</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden lg:table-cell">期限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ideas.map(idea => (
                <tr key={idea.id} className="table-row-hover cursor-pointer" onClick={() => window.location.href = `/ideas/${idea.id}`}>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-700">{idea.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{idea.summary}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500 hidden md:table-cell">{idea.submitter?.name || '-'}</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[idea.status]}`}>{idea.status}</span></td>
                  <td className="px-5 py-3 hidden sm:table-cell"><span className={`text-xs px-2 py-1 rounded-lg ${PRIORITY_COLORS[idea.priority]}`}>{idea.priority}</span></td>
                  <td className="px-5 py-3 text-xs text-slate-400 hidden lg:table-cell">{idea.deadline ? formatDate(idea.deadline) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {ideas.length === 0 && <div className="text-center py-12 text-sm text-slate-400">ネタがありません。最初のネタを追加しましょう！</div>}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {IDEA_STATUSES.map(status => (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[status]}`}>{status}</span>
                <span className="text-xs text-slate-400">{ideas.filter(i => i.status === status).length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {ideas.filter(i => i.status === status).map(idea => (
                  <Link key={idea.id} href={`/ideas/${idea.id}`} className="block bg-white rounded-xl border border-slate-200/80 shadow-sm p-3 card-hover">
                    <p className="text-xs font-medium text-slate-700 line-clamp-2">{idea.title}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[idea.priority]}`}>{idea.priority}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
