'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, ClipboardList, Clock, Send, Building, TrendingUp, CheckCircle, Eye } from 'lucide-react';
import { getDashboardStats, getApprovals, getSnsPosts, getEvents } from '@/lib/db/index';
import { STATUS_COLORS } from '@/lib/constants';
import { formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todayTasks: 0, pendingApprovals: 0, weeklyPosts: 0, monthlyProjects: 0,
    totalPosts: 0, totalReactions: 0, totalInquiries: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, approvalsData, postsData, eventsData] = await Promise.all([
        getDashboardStats(),
        getApprovals('確認依頼中'),
        getSnsPosts({ status: '承認済み' }),
        getEvents(),
      ]);
      setStats(statsData);
      setPendingApprovals(approvalsData?.slice(0, 5) || []);
      setUpcomingPosts(postsData?.slice(0, 5) || []);
      setEvents(eventsData?.slice(0, 3) || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-500" />
          ダッシュボード
        </h1>
        <p className="text-sm text-slate-500 mt-1">広報業務の全体状況</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ClipboardList className="w-5 h-5" />} label="進行中タスク" value={stats.todayTasks} color="blue" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="承認待ち" value={stats.pendingApprovals} color="amber" />
        <StatCard icon={<Send className="w-5 h-5" />} label="投稿予定" value={stats.weeklyPosts} color="green" />
        <StatCard icon={<Building className="w-5 h-5" />} label="全案件数" value={stats.monthlyProjects} color="indigo" />
      </div>

      {/* SNS実績 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 text-center card-hover">
          <p className="text-xs text-slate-500 mb-1">投稿数</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalPosts}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 text-center card-hover">
          <p className="text-xs text-slate-500 mb-1">反応数</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalReactions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 text-center card-hover">
          <p className="text-xs text-slate-500 mb-1">問い合わせ</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalInquiries}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 承認待ち */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">🔔 承認待ち</h2>
            <Link href="/approvals" className="text-xs text-blue-500 hover:text-blue-700">すべて見る</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingApprovals.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">承認待ちの案件はありません</div>
            ) : pendingApprovals.map((a: any) => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between table-row-hover">
                <div>
                  <p className="text-sm text-slate-700">{a.target_title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {a.target_type === 'sns_post' ? 'SNS投稿' : a.target_type === 'press_release' ? 'プレスリリース' : 'コンテンツ'}
                    {' / '}{a.requester?.name || ''}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[a.status]}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 投稿予定 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">📅 今後の投稿予定</h2>
            <Link href="/sns-posts" className="text-xs text-blue-500 hover:text-blue-700">すべて見る</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingPosts.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">投稿予定はありません</div>
            ) : upcomingPosts.map((p: any) => (
              <div key={p.id} className="px-5 py-3 flex items-center justify-between table-row-hover">
                <div>
                  <p className="text-sm text-slate-700">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.platform} / {p.scheduled_at ? formatDateTime(p.scheduled_at) : '未定'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[p.status]}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* イベント */}
      {events.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">🎉 直近のイベント</h2>
            <Link href="/events" className="text-xs text-blue-500 hover:text-blue-700">すべて見る</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {events.map((ev: any) => (
              <div key={ev.id} className="px-5 py-3 flex items-center justify-between table-row-hover">
                <div>
                  <p className="text-sm text-slate-700">{ev.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ev.event_date ? formatDate(ev.event_date) : ''} / {ev.venue}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[ev.status]}`}>{ev.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 card-hover">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
