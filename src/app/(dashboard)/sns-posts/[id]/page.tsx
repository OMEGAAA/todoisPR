'use client';
export const runtime = 'edge';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Calendar, Target, Hash, Copy, Edit } from 'lucide-react';
import { getSnsPostById, duplicateSnsPost } from '@/lib/db/index';
import { STATUS_COLORS, PLATFORM_COLORS } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

export default function SnsPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const addToast = useUIStore((s) => s.addToast);
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getSnsPostById(id).then(setPost).catch(() => {}).finally(() => setIsLoading(false)); }, [id]);

  const handleDuplicate = async () => {
    try { await duplicateSnsPost(id); addToast({ type: 'success', message: '投稿を複製しました' }); }
    catch { addToast({ type: 'error', message: '複製に失敗しました' }); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  if (!post) return <div className="text-center py-20"><p className="text-slate-400">投稿が見つかりません</p><Link href="/sns-posts" className="text-blue-500 text-sm mt-2 inline-block">一覧に戻る</Link></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/sns-posts" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
          <div><h1 className="text-xl font-bold text-slate-800">{post.title}</h1>
            <div className="flex items-center gap-2 mt-1"><span className={`text-xs px-2 py-1 rounded-lg ${PLATFORM_COLORS[post.platform]}`}>{post.platform}</span><span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[post.status]}`}>{post.status}</span></div></div></div>
        <button onClick={handleDuplicate} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all"><Copy className="w-4 h-4" /> 複製</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"><h2 className="text-sm font-semibold text-slate-800 mb-3">投稿本文</h2><p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{post.body}</p></div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"><h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Hash className="w-4 h-4 text-blue-500" /> ハッシュタグ</h2>
            <div className="flex flex-wrap gap-2">{(post.hashtags || []).map((tag: string) => <span key={tag} className="text-sm text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">{tag}</span>)}</div></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">投稿詳細</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-600"><Calendar className="w-4 h-4 text-slate-400" /><div><span className="text-xs text-slate-400 block">投稿日時</span>{post.scheduled_at ? formatDateTime(post.scheduled_at) : '未定'}</div></div>
            <div className="flex items-center gap-3 text-slate-600"><Target className="w-4 h-4 text-slate-400" /><div><span className="text-xs text-slate-400 block">投稿目的</span>{post.purpose || '未設定'}</div></div>
            <div className="flex items-center gap-3 text-slate-600"><Send className="w-4 h-4 text-slate-400" /><div><span className="text-xs text-slate-400 block">CTA</span>{post.cta || '未設定'}</div></div>
            <div className="flex items-center gap-3 text-slate-600"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[8px]">{(post.creator?.name || '?').charAt(0)}</div><div><span className="text-xs text-slate-400 block">作成者</span>{post.creator?.name || '-'}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
