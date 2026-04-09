'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Edit, CheckCircle, Calendar, Mail } from 'lucide-react';
import { getPressReleaseById } from '@/lib/db/index';
import { STATUS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function PressReleaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pr, setPr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getPressReleaseById(id).then(setPr).catch(() => {}).finally(() => setIsLoading(false)); }, [id]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  if (!pr) return <div className="text-center py-20"><p className="text-slate-400">プレスリリースが見つかりません</p><Link href="/press-releases" className="text-blue-500 text-sm mt-2 inline-block">一覧に戻る</Link></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/press-releases" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></Link>
          <div><div className="flex items-center gap-2 mb-1"><span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[pr.status]}`}>{pr.status}</span></div>
            <h1 className="text-xl font-bold text-slate-800">{pr.title}</h1>{pr.subtitle && <p className="text-sm text-slate-500">{pr.subtitle}</p>}</div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8 pb-4 border-b border-slate-200">
                <p className="text-sm text-slate-400 mb-2">{pr.release_date ? formatDate(pr.release_date) : ''}発表</p>
                <h2 className="text-xl font-bold text-slate-800 mb-1">{pr.title}</h2>{pr.subtitle && <p className="text-sm text-slate-500">{pr.subtitle}</p>}</div>
              {pr.summary && <div className="mb-6"><p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">{pr.summary}</p></div>}
              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{pr.body}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3 h-fit">
          <h3 className="text-sm font-semibold text-slate-800">リリース情報</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Calendar className="w-4 h-4 text-slate-400 mt-0.5" /><div><p className="text-xs text-slate-400">発表日</p><p className="text-sm text-slate-700">{pr.release_date ? formatDate(pr.release_date) : '-'}</p></div></div>
            <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-slate-400 mt-0.5" /><div><p className="text-xs text-slate-400">問い合わせ先</p><p className="text-sm text-slate-700">{pr.contact_info || '-'}</p></div></div>
            {pr.distribution_targets?.length > 0 && <div><p className="text-xs text-slate-400 mb-1">配信先</p><div className="flex flex-wrap gap-1">{pr.distribution_targets.map((t: string) => <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{t}</span>)}</div></div>}
            <div><p className="text-xs text-slate-400">作成者</p><p className="text-sm text-slate-700">{pr.creator?.name || '-'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
