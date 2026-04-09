'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Plus, CheckSquare, Square, Camera } from 'lucide-react';
import { getEvents, updateEvent } from '@/lib/db/index';
import { STATUS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

export default function EventsPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getEvents().then(d => setEvents(d || [])).catch(() => {}).finally(() => setIsLoading(false)); }, []);

  const toggleTask = async (eventId: string, taskIdx: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const tasks = [...(event.tasks || [])];
    tasks[taskIdx] = { ...tasks[taskIdx], completed: !tasks[taskIdx].completed };
    try {
      await updateEvent(eventId, { tasks });
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, tasks } : e));
    } catch { addToast({ type: 'error', message: '更新に失敗しました' }); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-indigo-500" /> イベント広報管理</h1><p className="text-sm text-slate-500 mt-1">イベント広報タスクの進行管理</p></div>
      </div>
      {events.length === 0 ? <div className="text-center py-12 text-sm text-slate-400">イベントがありません</div> :
      <div className="space-y-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-start justify-between"><div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[event.status]}`}>{event.status}</span>
                  {!event.photo_collected && <span className="text-xs px-2 py-1 rounded-lg bg-orange-100 text-orange-700 flex items-center gap-1"><Camera className="w-3 h-3" /> 写真未回収</span>}</div>
                <h2 className="text-lg font-semibold text-slate-800">{event.name}</h2>
                <p className="text-sm text-slate-500 mt-1">📅 {event.event_date ? formatDate(event.event_date) : '-'} / 📍 {event.venue} / 🎯 {event.target_audience}</p></div></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['before','during','after'] as const).map(phase => {
                  const tasks = (event.tasks || []).filter((t: any) => t.phase === phase);
                  const phaseLabel = phase === 'before' ? 'イベント前' : phase === 'during' ? '当日' : 'イベント後';
                  const completed = tasks.filter((t: any) => t.completed).length;
                  return (
                    <div key={phase}><div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-slate-700">{phaseLabel}</h3><span className="text-xs text-slate-400">{completed}/{tasks.length}</span></div>
                      <div className="space-y-2">{tasks.map((task: any, idx: number) => {
                        const globalIdx = (event.tasks || []).indexOf(task);
                        return (
                          <button key={idx} onClick={() => toggleTask(event.id, globalIdx)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${task.completed ? 'bg-green-50' : 'bg-slate-50 hover:bg-blue-50'}`}>
                            {task.completed ? <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                            <div className="flex-1 min-w-0"><p className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p><p className="text-[11px] text-slate-400">{task.assignee}</p></div>
                          </button>);
                      })}</div></div>);
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div><p className="text-xs text-slate-400 mb-1">告知開始日</p><p className="text-slate-700">{event.announcement_start ? formatDate(event.announcement_start) : '-'}</p></div>
                <div><p className="text-xs text-slate-400 mb-1">撮影担当</p><p className="text-slate-700">{event.photographer || '-'}</p></div>
                <div><p className="text-xs text-slate-400 mb-1">投稿計画</p><p className="text-slate-700">{event.posting_plan || '-'}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}
