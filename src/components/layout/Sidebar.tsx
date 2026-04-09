'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { SIDEBAR_NAV } from '@/lib/constants';
import {
  LayoutDashboard, Lightbulb, Calendar, Send, FileText,
  Users, Image, CheckCircle, BarChart3, CalendarDays,
  AlertTriangle, Megaphone, LogOut, ChevronLeft, ChevronRight,
  X,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Lightbulb, Calendar, Send, FileText,
  Users, Image, CheckCircle, BarChart3, CalendarDays, AlertTriangle,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* モバイルオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } overflow-hidden`}
      >
        {/* ロゴ */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-700/50 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-bold whitespace-nowrap">PR Manager</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {SIDEBAR_NAV.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border-l-3 border-blue-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />}
                  {sidebarOpen && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* サイドバー折りたたみボタン（デスクトップ） */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center py-3 border-t border-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* ユーザー情報 */}
        <div className="border-t border-slate-700/50 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {profile?.name?.charAt(0) ?? '?'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.name}</p>
                <p className="text-xs text-slate-400 truncate">{profile?.role}</p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
                title="ログアウト"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
