'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { getApprovals, updateApprovalStatus } from '@/lib/db/index';
import { STATUS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

export default function ApprovalsPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [allApprovals, setAllApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try { const d = await getApprovals(filter !== 'all' ? filter : undefined); setApprovals(d || []); if (filter === 'all') setAllApprovals(d || []); }
    catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string) => {
    try { await updateApprovalStatus(id, '承認済み'); addToast({ type: 'success', message: '承認しました' }); load(); }
    catch { addToast({ type: 'error', message: '承認に失敗しました' }); }
  };

  const handleReject = async (id: string) => {
    const comment = prompt('差し戻しコメントを入力してください');
    try { await updateApprovalStatus(id, '差し戻し', comment || ''); addToast({ type: 'warning', message: '差し戻しました' }); load(); }
    catch { addToast({ type: 'error', message: '差し戻しに失敗しました' }); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  const counts = { all: allApprovals.length, '確認依頼中': allApprovals.filter(a => a.status === '確認依頼中').length, '承認済み': allApprovals.filter(a => a.status === '承認済み').length, '差し戻し': allApprovals.filter(a => a.status === '差し戻し').length };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-500" /> 承認一覧</h1><p className="text-sm text-slate-500 mt-1">投稿・リリースの承認管理</p></div>
      <div className="flex items-center gap-2">
        {[{ key: 'all', label: 'すべて' }, { key: '確認依頼中', label: '確認依頼中' }, { key: '承認済み', label: '承認済み' }, { key: '差し戻し', label: '差し戻し' }].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} className={`px-4 py-2 rounded-xl text-sm transition-all ${filter === tab.key ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {tab.label} <span className="ml-1 opacity-70">({counts[tab.key as keyof typeof counts] || 0})</span></button>))}
      </div>
      <div className="space-y-3">
        {approvals.length === 0 ? <div className="text-center py-12 text-sm text-slate-400">承認案件がありません</div> :
        approvals.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{a.target_type === 'sns_post' ? 'SNS投稿' : a.target_type === 'press_release' ? 'プレスリリース' : 'コンテンツ'}</span></div>
                <h3 className="text-sm font-semibold text-slate-800">{a.target_title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>申請者: {a.requester?.name || '-'}</span><span>承認者: {a.approver?.name || '-'}</span>
                  <span>申請日: {a.requested_at ? formatDate(a.requested_at) : '-'}</span>{a.resolved_at && <span>処理日: {formatDate(a.resolved_at)}</span>}</div>
                {a.comment && <div className="mt-3 flex items-start gap-2 p-3 bg-slate-50 rounded-xl"><MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" /><p className="text-xs text-slate-600">{a.comment}</p></div>}
              </div>
              {a.status === '確認依頼中' && (
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => handleReject(a.id)} className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-xl text-xs hover:bg-red-50 transition-all"><XCircle className="w-3.5 h-3.5" /> 差し戻し</button>
                  <button onClick={() => handleApprove(a.id)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs hover:bg-green-700 transition-all shadow-md"><CheckCircle className="w-3.5 h-3.5" /> 承認</button>
                </div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
