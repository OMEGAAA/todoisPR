'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { createPressRelease } from '@/lib/db/index';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

export default function NewPressReleasePage() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', release_date: '', summary: '', body: '', contact_info: '', distribution_targets: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.release_date) { addToast({ type: 'error', message: '必須項目を入力してください' }); return; }
    setIsSubmitting(true);
    try {
      await createPressRelease({ ...formData, distribution_targets: formData.distribution_targets.split(',').map(s => s.trim()).filter(Boolean), created_by: user?.id || '' });
      addToast({ type: 'success', message: 'プレスリリースを作成しました' }); router.push('/press-releases');
    } catch { addToast({ type: 'error', message: '作成に失敗しました' }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/press-releases" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-500" /> プレスリリース作成</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">タイトル <span className="text-red-500">*</span></label>
          <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">サブタイトル</label>
          <input type="text" value={formData.subtitle} onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">発表日 <span className="text-red-500">*</span></label>
            <input type="date" value={formData.release_date} onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">配信先</label>
            <input type="text" value={formData.distribution_targets} onChange={(e) => setFormData(prev => ({ ...prev, distribution_targets: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="カンマ区切り" /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">概要</label>
          <textarea value={formData.summary} onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">本文</label>
          <textarea value={formData.body} onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))} rows={12} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none font-mono leading-relaxed" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">問い合わせ先</label>
          <input type="text" value={formData.contact_info} onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href="/press-releases" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-all">キャンセル</Link>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />} {isSubmitting ? '保存中...' : '保存する'}</button>
        </div>
      </form>
    </div>
  );
}
