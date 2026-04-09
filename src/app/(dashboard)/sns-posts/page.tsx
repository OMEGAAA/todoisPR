'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Send, Plus, Search, Copy, Eye } from 'lucide-react';
import { getSnsPosts } from '@/lib/db/index';
import { SNS_POST_STATUSES, STATUS_COLORS, PLATFORM_COLORS } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';

export default function SnsPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  const load = useCallback(async () => {
    try { const d = await getSnsPosts({ status: statusFilter, platform: platformFilter, search: searchQuery }); setPosts(d || []); }
    catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [statusFilter, platformFilter, searchQuery]);

  useEffect(() => { load(); }, [load]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Send className="w-6 h-6 text-green-500" /> SNS投稿管理</h1><p className="text-sm text-slate-500 mt-1">SNS投稿の作成・予約・管理</p></div>
        <Link href="/sns-posts/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20"><Plus className="w-4 h-4" /> 新規投稿作成</Link>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 flex-1 w-full sm:w-auto focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400" /><input type="text" placeholder="投稿を検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm outline-none w-full" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
          <option value="all">すべてのステータス</option>{SNS_POST_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
          <option value="all">すべての媒体</option><option value="Instagram">Instagram</option><option value="X">X</option><option value="TikTok">TikTok</option><option value="LINE">LINE</option></select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover">
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-lg ${PLATFORM_COLORS[post.platform]}`}>{post.platform}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg ${STATUS_COLORS[post.status]}`}>{post.status}</span></div>
              <Link href={`/sns-posts/${post.id}`} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all"><Eye className="w-3.5 h-3.5" /></Link></div>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">{post.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 mb-3 whitespace-pre-line">{post.body}</p>
              <div className="flex flex-wrap gap-1 mb-3">{(post.hashtags || []).map((tag: string) => <span key={tag} className="text-[11px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{tag}</span>)}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
                <span>📅 {post.scheduled_at ? formatDateTime(post.scheduled_at) : '未定'}</span><span>{post.creator?.name || ''}</span></div>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && <div className="text-center py-12 text-sm text-slate-400">投稿がありません</div>}
    </div>
  );
}
