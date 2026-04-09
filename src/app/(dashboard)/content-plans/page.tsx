'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getContentPlans } from '@/lib/db/index';
import { STATUS_COLORS, PLATFORM_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';

export default function ContentPlansPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getContentPlans().then(d => setPlans(d || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) { days.push(day); day = addDays(day, 1); }

  const getPlansForDate = (date: Date) => plans.filter(p => { try { return isSameDay(parseISO(p.publish_date), date); } catch { return false; } });
  const selectedPlans = selectedDate ? getPlansForDate(selectedDate) : [];

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-500" /> コンテンツカレンダー</h1>
          <p className="text-sm text-slate-500 mt-1">月間の発信予定を管理</p>
        </div>
        <Link href="/content-plans/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20"><Plus className="w-4 h-4" /> 企画追加</Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
          <h2 className="text-lg font-semibold text-slate-800">{format(currentMonth, 'yyyy年 M月', { locale: ja })}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['月','火','水','木','金','土','日'].map(d => (
            <div key={d} className={`text-center py-2 text-xs font-semibold ${d === '土' ? 'text-blue-500' : d === '日' ? 'text-red-500' : 'text-slate-500'}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayPlans = getPlansForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            return (
              <button key={i} onClick={() => setSelectedDate(day)}
                className={`min-h-[100px] p-2 border-b border-r border-slate-50 text-left transition-colors ${isCurrentMonth ? 'bg-white' : 'bg-slate-50/50'} ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200 ring-inset' : 'hover:bg-slate-50'}`}>
                <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-blue-600 text-white' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}`}>{format(day, 'd')}</span>
                <div className="mt-1 space-y-1">
                  {dayPlans.slice(0, 2).map(p => <div key={p.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${PLATFORM_COLORS[p.media] || 'bg-gray-100 text-gray-600'}`}>{p.title}</div>)}
                  {dayPlans.length > 2 && <div className="text-[10px] text-slate-400 px-1.5">+{dayPlans.length - 2}件</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">{format(selectedDate, 'yyyy年M月d日（E）', { locale: ja })} の企画</h3>
          {selectedPlans.length === 0 ? <p className="text-sm text-slate-400">この日の企画はありません</p> : (
            <div className="space-y-3">
              {selectedPlans.map(plan => (
                <div key={plan.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{plan.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${PLATFORM_COLORS[plan.media]}`}>{plan.media}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[plan.status]}`}>{plan.status}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_COLORS[plan.priority]}`}>{plan.priority}</span>
                      <span className="text-xs text-slate-400">担当: {plan.assignee?.name || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-semibold text-slate-800">コンテンツ企画一覧</h3></div>
        <div className="divide-y divide-slate-50">
          {plans.length === 0 ? <div className="px-5 py-8 text-center text-sm text-slate-400">企画がありません</div> :
          plans.map(plan => (
            <div key={plan.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20">{plan.publish_date ? format(parseISO(plan.publish_date), 'MM/dd（E）', { locale: ja }) : '-'}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${PLATFORM_COLORS[plan.media]}`}>{plan.media}</span>
                <span className="text-sm text-slate-700">{plan.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{plan.assignee?.name || '-'}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[plan.status]}`}>{plan.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
