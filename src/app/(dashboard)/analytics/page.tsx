'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { getPerformanceReports } from '@/lib/db/index';
import { formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const platformData = [
  { name: 'Instagram', value: 45, color: '#E1306C' }, { name: 'X', value: 25, color: '#1DA1F2' },
  { name: 'LINE', value: 20, color: '#00B900' }, { name: 'Web', value: 10, color: '#6366F1' },
];

export default function AnalyticsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getPerformanceReports().then(d => setReports(d || [])).catch(() => {}).finally(() => setIsLoading(false)); }, []);

  const totalImpressions = reports.reduce((s, r) => s + (r.impressions || 0), 0);
  const totalLikes = reports.reduce((s, r) => s + (r.likes || 0), 0);
  const totalInquiries = reports.reduce((s, r) => s + (r.inquiries || 0), 0);
  const totalApplications = reports.reduce((s, r) => s + (r.applications || 0), 0);

  const chartData = reports.slice(0, 6).map(r => ({ name: r.target_title?.substring(0, 8) || '', impressions: r.impressions, likes: r.likes, inquiries: r.inquiries }));

  const handleExportCSV = () => {
    const headers = ['対象', 'タイプ', '表示回数', 'いいね', '保存数', 'コメント', '問い合わせ', '申込数', '期間'];
    const rows = reports.map(r => [r.target_title, r.target_type, r.impressions, r.likes, r.saves, r.comments, r.inquiries, r.applications, `${r.period_start || ''}〜${r.period_end || ''}`]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `performance_report_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="w-6 h-6 text-cyan-500" /> 効果測定・レポート</h1><p className="text-sm text-slate-500 mt-1">広報施策の効果を可視化</p></div>
        <button onClick={handleExportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all"><Download className="w-4 h-4" /> CSV出力</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="総表示回数" value={totalImpressions.toLocaleString()} />
        <SummaryCard label="総いいね数" value={totalLikes.toLocaleString()} />
        <SummaryCard label="問い合わせ数" value={totalInquiries.toString()} />
        <SummaryCard label="申込数" value={totalApplications.toString()} />
      </div>
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"><h3 className="text-sm font-semibold text-slate-800 mb-4">表示回数</h3>
            <ResponsiveContainer width="100%" height={300}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} /><Bar dataKey="impressions" fill="#3b82f6" radius={[6,6,0,0]} name="表示回数" /></BarChart></ResponsiveContainer></div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"><h3 className="text-sm font-semibold text-slate-800 mb-4">エンゲージメント</h3>
            <ResponsiveContainer width="100%" height={300}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" /><Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} /><Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="いいね" /><Line type="monotone" dataKey="inquiries" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="問い合わせ" /></LineChart></ResponsiveContainer></div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-semibold text-slate-800">パフォーマンスレポート詳細</h3></div>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-slate-100 bg-slate-50/80">
          <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">対象</th><th className="text-right text-xs font-semibold text-slate-500 px-3 py-3">表示</th>
          <th className="text-right text-xs font-semibold text-slate-500 px-3 py-3">いいね</th><th className="text-right text-xs font-semibold text-slate-500 px-3 py-3">問合せ</th>
          <th className="text-right text-xs font-semibold text-slate-500 px-3 py-3">申込</th><th className="text-left text-xs font-semibold text-slate-500 px-3 py-3">期間</th></tr></thead>
        <tbody className="divide-y divide-slate-50">{reports.map(r => (
          <tr key={r.id} className="table-row-hover"><td className="px-5 py-3 text-sm text-slate-700">{r.target_title}</td><td className="px-3 py-3 text-sm text-slate-600 text-right">{(r.impressions || 0).toLocaleString()}</td>
            <td className="px-3 py-3 text-sm text-slate-600 text-right">{r.likes}</td><td className="px-3 py-3 text-sm text-slate-600 text-right">{r.inquiries}</td>
            <td className="px-3 py-3 text-sm text-slate-600 text-right">{r.applications}</td>
            <td className="px-3 py-3 text-xs text-slate-400">{r.period_start ? formatDate(r.period_start) : ''}〜{r.period_end ? formatDate(r.period_end) : ''}</td></tr>))}</tbody></table></div>
        {reports.length === 0 && <div className="px-5 py-8 text-center text-sm text-slate-400">レポートデータがありません</div>}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 card-hover"><p className="text-xs text-slate-500 mb-1">{label}</p><p className="text-2xl font-bold text-slate-800">{value}</p></div>;
}
