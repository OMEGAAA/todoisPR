'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Camera, Hash } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';
import { createSnsPost } from '@/lib/db/index';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

export default function NewSnsPostPage() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', hashtags: '', scheduled_at: '', platform: 'Instagram', purpose: '', cta: '', status: '下書き' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) { addToast({ type: 'error', message: 'タイトルと本文を入力してください' }); return; }
    setIsSubmitting(true);
    try {
      const hashtagArray = formData.hashtags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : '#' + t);
      await createSnsPost({ ...formData, hashtags: hashtagArray, created_by: user?.id || '' });
      addToast({ type: 'success', message: 'SNS投稿を作成しました' }); router.push('/sns-posts');
    } catch { addToast({ type: 'error', message: '作成に失敗しました' }); }
    finally { setIsSubmitting(false); }
  };

  const hashtagArray = formData.hashtags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : '#' + t);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/sns-posts" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Send className="w-6 h-6 text-green-500" /> 新規SNS投稿作成</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">投稿タイトル <span className="text-red-500">*</span></label>
              <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="投稿のタイトル" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">掲載媒体</label>
                <select value={formData.platform} onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
                  {PLATFORMS.filter(p => !['プレスリリース','Web'].includes(p)).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">投稿日時</label>
                <input type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">本文 <span className="text-red-500">*</span></label>
              <textarea value={formData.body} onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))} rows={6} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" placeholder="投稿の本文を入力" />
              <p className="text-xs text-slate-400 mt-1">{formData.body.length}文字</p></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">ハッシュタグ</label>
              <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10">
                <Hash className="w-4 h-4 text-slate-400" /><input type="text" value={formData.hashtags} onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))} className="bg-transparent text-sm outline-none w-full" placeholder="カンマ区切りで入力" /></div>
              {hashtagArray.length > 0 && formData.hashtags.trim() && <div className="flex flex-wrap gap-1 mt-2">{hashtagArray.map((tag, i) => <span key={i} className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{tag}</span>)}</div>}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">投稿目的</label>
                <input type="text" value={formData.purpose} onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">CTA</label>
                <select value={formData.cta} onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
                  <option value="">選択してください</option><option value="体験申込">体験申込</option><option value="問い合わせ">問い合わせ</option><option value="HP誘導">HP誘導</option><option value="イベント申込">イベント申込</option></select></div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link href="/sns-posts" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-all">キャンセル</Link>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />} {isSubmitting ? '保存中...' : '保存する'}</button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2"><div className="sticky top-20"><div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50"><h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Camera className="w-4 h-4 text-pink-500" /> 投稿プレビュー</h3></div>
          <div className="p-0">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 p-0.5"><div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700">AG</div></div>
              <div><p className="text-xs font-semibold text-slate-800">antigravity_official</p><p className="text-[10px] text-slate-400">{formData.platform}</p></div></div>
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"><div className="text-center"><Camera className="w-12 h-12 text-slate-300 mx-auto mb-2" /><p className="text-xs text-slate-400">画像プレビュー</p></div></div>
            <div className="px-4 py-3"><p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{formData.body || '本文がここに表示されます...'}</p>
              {hashtagArray.length > 0 && formData.hashtags.trim() && <p className="text-xs text-blue-500 mt-2">{hashtagArray.join(' ')}</p>}</div>
          </div>
        </div></div></div>
      </div>
    </div>
  );
}
