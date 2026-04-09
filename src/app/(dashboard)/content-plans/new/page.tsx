'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { PLATFORMS, CONTENT_PURPOSES, PRIORITIES } from '@/lib/constants';
import { createContentPlan, getProfiles } from '@/lib/db/index';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewContentPlanPage() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', media: 'Instagram', publish_date: '', purpose: '認知', target: '', assignee_id: '', priority: '中', notes: '' });

  useEffect(() => { getProfiles().then(d => { setUsers(d || []); if (d?.length) setFormData(prev => ({ ...prev, assignee_id: d[0].id })); }).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.publish_date) { addToast({ type: 'error', message: '必須項目を入力してください' }); return; }
    setIsSubmitting(true);
    try { await createContentPlan(formData); addToast({ type: 'success', message: 'コンテンツ企画を作成しました' }); router.push('/content-plans'); }
    catch { addToast({ type: 'error', message: '作成に失敗しました' }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/content-plans" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-500" /> 新規コンテンツ企画</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">企画名 <span className="text-red-500">*</span></label>
          <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="企画名を入力" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">媒体</label>
            <select value={formData.media} onChange={(e) => setFormData(prev => ({ ...prev, media: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">{PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">投稿日 <span className="text-red-500">*</span></label>
            <input type="date" value={formData.publish_date} onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">目的</label>
            <select value={formData.purpose} onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">{CONTENT_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">担当者</label>
            <select value={formData.assignee_id} onChange={(e) => setFormData(prev => ({ ...prev, assignee_id: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">優先度</label>
            <select value={formData.priority} onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">{PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">備考</label>
          <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" /></div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href="/content-plans" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-all">キャンセル</Link>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />} {isSubmitting ? '作成中...' : '登録する'}</button>
        </div>
      </form>
    </div>
  );
}
