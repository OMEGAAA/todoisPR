'use client';
export const runtime = 'edge';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Mail, Phone, ExternalLink } from 'lucide-react';
import { getMediaContactById } from '@/lib/db/index';
import { formatDate } from '@/lib/utils';

export default function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mc, setMc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getMediaContactById(id).then(setMc).catch(() => {}).finally(() => setIsLoading(false)); }, [id]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  if (!mc) return <div className="text-center py-20"><p className="text-slate-400">メディア情報が見つかりません</p><Link href="/media" className="text-blue-500 text-sm mt-2 inline-block">一覧に戻る</Link></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/media" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <div><h1 className="text-xl font-bold text-slate-800">{mc.outlet_name}</h1><p className="text-sm text-slate-500">{mc.contact_name}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">対応履歴</h2>
            {(mc.history || []).length === 0 ? <p className="text-sm text-slate-400">履歴はありません</p> :
            <div className="space-y-3">{mc.history.map((h: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"><div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div><div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium text-slate-700">{h.type}</span><span className="text-xs text-slate-400">{h.date ? formatDate(h.date) : ''}</span></div>
                  <p className="text-sm text-slate-600">{h.content}</p></div></div>))}</div>}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">掲載実績</h2>
            {(mc.coverage_records || []).length === 0 ? <p className="text-sm text-slate-400">掲載実績はありません</p> :
            <div className="space-y-3">{mc.coverage_records.map((cr: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl"><div><p className="text-sm font-medium text-slate-700">{cr.title}</p><p className="text-xs text-slate-400">{cr.date ? formatDate(cr.date) : ''}</p></div>
                {cr.url && <a href={cr.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><ExternalLink className="w-4 h-4" /></a>}</div>))}</div>}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3 h-fit">
          <h3 className="text-sm font-semibold text-slate-800">連絡先</h3>
          <div className="space-y-3"><div className="flex items-center gap-3 text-sm text-slate-600"><Mail className="w-4 h-4 text-slate-400" /> {mc.email}</div><div className="flex items-center gap-3 text-sm text-slate-600"><Phone className="w-4 h-4 text-slate-400" /> {mc.phone}</div></div>
          <div className="pt-3 border-t border-slate-100"><p className="text-xs text-slate-400 mb-1">関心ジャンル</p><div className="flex flex-wrap gap-1">{(mc.genres || []).map((g: string) => <span key={g} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{g}</span>)}</div></div>
          {mc.notes && <div className="pt-3 border-t border-slate-100"><p className="text-xs text-slate-400 mb-1">備考</p><p className="text-sm text-slate-600">{mc.notes}</p></div>}
        </div>
      </div>
    </div>
  );
}
