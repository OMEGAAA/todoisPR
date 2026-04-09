'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Lightbulb } from 'lucide-react';
import { IDEA_STATUSES, PRIORITIES, PLATFORMS } from '@/lib/constants';
import { createIdea } from '@/lib/db/ideas';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

export default function NewIdeaPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', summary: '', purpose: '', target: '',
    media: [] as string[], deadline: '', status: '未着手', priority: '中',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { addToast({ type: 'error', message: 'タイトルを入力してください' }); return; }

    setIsSubmitting(true);
    try {
      await createIdea({ ...formData, submitter_id: user?.id || '' });
      addToast({ type: 'success', message: '広報ネタを登録しました' });
      router.push('/ideas');
    } catch (err) {
      addToast({ type: 'error', message: '登録に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMedia = (m: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.includes(m) ? prev.media.filter(x => x !== m) : [...prev.media, m],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/ideas" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Lightbulb className="w-6 h-6 text-yellow-500" /> 新規ネタ登録</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">タイトル <span className="text-red-500">*</span></label>
          <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="ネタのタイトル" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">概要</label>
          <textarea value={formData.summary} onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))} rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">目的</label>
            <input type="text" value={formData.purpose} onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ターゲット</label>
            <input type="text" value={formData.target} onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">掲載媒体</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(m => (
              <button key={m} type="button" onClick={() => toggleMedia(m)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${formData.media.includes(m) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{m}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">期限</label>
            <input type="date" value={formData.deadline} onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ステータス</label>
            <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
              {IDEA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">優先度</label>
            <select value={formData.priority} onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href="/ideas" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-all">キャンセル</Link>
          <button type="submit" disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  );
}
