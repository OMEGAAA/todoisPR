'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Search, Grid, List, FileText, Film, Palette, File } from 'lucide-react';
import { getAssets, uploadAsset } from '@/lib/db/index';
import { ASSET_FILE_TYPES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

const fileTypeIcons: Record<string, React.ReactNode> = {
  '画像': <ImageIcon className="w-8 h-8 text-blue-400" />, '動画': <Film className="w-8 h-8 text-purple-400" />,
  'ロゴ': <Palette className="w-8 h-8 text-pink-400" />, 'PDF': <FileText className="w-8 h-8 text-red-400" />, 'その他': <File className="w-8 h-8 text-gray-400" />,
};

export default function AssetsPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => { getAssets({ type: typeFilter, search: searchQuery }).then(d => setAssets(d || [])).catch(() => {}).finally(() => setIsLoading(false)); }, [typeFilter, searchQuery]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let fileType = 'その他';
      if (file.type.startsWith('image/')) fileType = '画像';
      else if (file.type.startsWith('video/')) fileType = '動画';
      else if (file.type === 'application/pdf') fileType = 'PDF';
      await uploadAsset(file, { filename: file.name, file_type: fileType, folder: 'general', tags: [], usage_scope: '社内', uploaded_by: user?.id || '' });
      addToast({ type: 'success', message: 'ファイルをアップロードしました' });
      const d = await getAssets({ type: typeFilter, search: searchQuery }); setAssets(d || []);
    } catch { addToast({ type: 'error', message: 'アップロードに失敗しました' }); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-teal-500" /> 素材管理</h1><p className="text-sm text-slate-500 mt-1">画像・動画・ロゴ・PDFの管理</p></div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20 cursor-pointer">
          <Upload className="w-4 h-4" /> アップロード<input type="file" className="hidden" onChange={handleUpload} /></label>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 flex-1 w-full sm:w-auto focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400" /><input type="text" placeholder="ファイル名・タグで検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm outline-none w-full" /></div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
          <option value="all">すべての種別</option>{ASSET_FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><List className="w-4 h-4" /></button></div>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover">
              <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                {a.file_url && a.file_type === '画像' ? <img src={a.file_url} alt={a.filename} className="w-full h-full object-cover" /> : fileTypeIcons[a.file_type] || fileTypeIcons['その他']}</div>
              <div className="p-3"><p className="text-xs font-medium text-slate-700 truncate">{a.filename}</p><p className="text-[11px] text-slate-400 mt-0.5">{a.folder} / {a.file_type}</p>
                <div className="flex flex-wrap gap-1 mt-2">{(a.tags || []).slice(0, 2).map((t: string) => <span key={t} className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">{t}</span>)}</div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full"><thead><tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ファイル名</th><th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">種別</th>
            <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden md:table-cell">フォルダ</th><th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">日付</th></tr></thead>
          <tbody className="divide-y divide-slate-50">{assets.map(a => (
            <tr key={a.id} className="table-row-hover"><td className="px-5 py-3 text-sm text-slate-700">{a.filename}</td><td className="px-5 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{a.file_type}</span></td>
              <td className="px-5 py-3 text-sm text-slate-500 hidden md:table-cell">{a.folder}</td><td className="px-5 py-3 text-xs text-slate-400">{a.uploaded_at ? formatDate(a.uploaded_at) : '-'}</td></tr>))}</tbody></table>
        </div>
      )}
      {assets.length === 0 && <div className="text-center py-12 text-sm text-slate-400">素材がありません</div>}
    </div>
  );
}
