'use client';
export const runtime = 'edge';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Edit, Trash2 } from 'lucide-react';
import { getIdeaById, deleteIdea } from '@/lib/db/ideas';
import { STATUS_COLORS, PRIORITY_COLORS, PLATFORM_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';

export default function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const [idea, setIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getIdeaById(id).then(setIdea).catch(() => {}).finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('このネタを削除しますか？')) return;
    try {
      await deleteIdea(id);
      addToast({ type: 'success', message: 'ネタを削除しました' });
      router.push('/ideas');
    } catch { addToast({ type: 'error', message: '削除に失敗しました' }); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  if (!idea) return <div className="text-center py-20"><p className="text-slate-400">ネタが見つかりません</p><Link href="/ideas" className="text-blue-500 text-sm mt-2 inline-block">一覧に戻る</Link></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/ideas" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-slate-800">{idea.title}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-xl text-xs hover:bg-red-50 transition-all">
            <Trash2 className="w-3.5 h-3.5" /> 削除
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[idea.status]}`}>{idea.status}</span>
          <span className={`text-xs px-2 py-1 rounded-lg ${PRIORITY_COLORS[idea.priority]}`}>{idea.priority}</span>
        </div>
        {idea.summary && <div><p className="text-xs text-slate-400 mb-1">概要</p><p className="text-sm text-slate-700">{idea.summary}</p></div>}
        <div className="grid grid-cols-2 gap-4">
          {idea.purpose && <div><p className="text-xs text-slate-400 mb-1">目的</p><p className="text-sm text-slate-700">{idea.purpose}</p></div>}
          {idea.target && <div><p className="text-xs text-slate-400 mb-1">ターゲット</p><p className="text-sm text-slate-700">{idea.target}</p></div>}
        </div>
        {idea.media?.length > 0 && (
          <div><p className="text-xs text-slate-400 mb-1">媒体</p><div className="flex flex-wrap gap-1">{idea.media.map((m: string) => <span key={m} className={`text-xs px-2 py-0.5 rounded ${PLATFORM_COLORS[m] || 'bg-gray-100 text-gray-600'}`}>{m}</span>)}</div></div>
        )}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div><p className="text-xs text-slate-400 mb-1">投稿者</p><p className="text-sm text-slate-700">{idea.submitter?.name || '-'}</p></div>
          <div><p className="text-xs text-slate-400 mb-1">期限</p><p className="text-sm text-slate-700">{idea.deadline ? formatDate(idea.deadline) : '未設定'}</p></div>
        </div>
      </div>
    </div>
  );
}
