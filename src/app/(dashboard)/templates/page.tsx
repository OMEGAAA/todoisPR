'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Copy, Edit, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { getTemplates } from '@/lib/db/index';
import { TEMPLATE_CATEGORIES } from '@/lib/constants';
import { useUIStore } from '@/stores/ui-store';

const categoryColors: Record<string, string> = {
  '謝罪文': 'bg-red-100 text-red-700', 'お知らせ': 'bg-blue-100 text-blue-700', '休講・延期': 'bg-yellow-100 text-yellow-700',
  'システム不具合': 'bg-purple-100 text-purple-700', '事故・トラブル': 'bg-orange-100 text-orange-700', 'プレスリリース': 'bg-indigo-100 text-indigo-700',
};

export default function TemplatesPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { const d = await getTemplates({ category: categoryFilter, search: searchQuery }); setTemplates(d || []); }
    catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [categoryFilter, searchQuery]);

  useEffect(() => { load(); }, [load]);

  const handleCopy = (tmpl: any) => {
    navigator.clipboard.writeText(tmpl.body).then(() => addToast({ type: 'success', message: 'テンプレートをクリップボードにコピーしました' }))
      .catch(() => addToast({ type: 'info', message: 'テンプレートを複製しました' }));
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-amber-500" /> 緊急対応テンプレート</h1><p className="text-sm text-slate-500 mt-1">緊急時の文案テンプレートを管理</p></div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 flex-1 w-full sm:w-auto focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400" /><input type="text" placeholder="テンプレートを検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm outline-none w-full" /></div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300">
          <option value="all">すべてのカテゴリ</option>{TEMPLATE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
      </div>
      <div className="space-y-3">
        {templates.length === 0 ? <div className="text-center py-12 text-sm text-slate-400">テンプレートがありません</div> :
        templates.map(tmpl => {
          const isExpanded = expandedId === tmpl.id;
          return (
            <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <button onClick={() => setExpandedId(isExpanded ? null : tmpl.id)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><span className={`text-xs px-2.5 py-1 rounded-lg ${categoryColors[tmpl.category] || 'bg-gray-100 text-gray-700'}`}>{tmpl.category}</span><h3 className="text-sm font-semibold text-slate-800">{tmpl.title}</h3></div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}</button>
              {isExpanded && (
                <div className="px-6 pb-5 animate-fade-in">
                  <div className="bg-slate-50 rounded-xl p-5 mb-4"><p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{tmpl.body}</p></div>
                  {(tmpl.variables || []).length > 0 && <div className="mb-4"><p className="text-xs text-slate-400 mb-2">差し込み変数：</p>
                    <div className="flex flex-wrap gap-2">{tmpl.variables.map((v: string) => <span key={v} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-200">{`{{${v}}}`}</span>)}</div></div>}
                  <button onClick={() => handleCopy(tmpl)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs hover:bg-blue-700 transition-all shadow-md"><Copy className="w-3.5 h-3.5" /> コピーして使う</button>
                </div>)}
            </div>);
        })}
      </div>
    </div>
  );
}
