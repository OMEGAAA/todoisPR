'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Megaphone, Eye, EyeOff, UserPlus } from 'lucide-react';
import { USER_ROLES } from '@/lib/constants';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '閲覧者',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) { setError('名前を入力してください'); return; }
    if (!formData.email) { setError('メールアドレスを入力してください'); return; }
    if (!formData.password) { setError('パスワードを入力してください'); return; }
    if (formData.password.length < 6) { setError('パスワードは6文字以上にしてください'); return; }
    if (formData.password !== formData.confirmPassword) { setError('パスワードが一致しません'); return; }

    setIsLoading(true);
    const result = await signup(formData.email, formData.password, formData.name, formData.role);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">登録完了</h2>
          <p className="text-sm text-slate-500">ダッシュボードに移動します...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg shadow-blue-500/25 mb-4">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">PR Manager</h1>
          <p className="text-sm text-slate-500 mt-1">新規ユーザー登録</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">名前 <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="山田太郎" disabled={isLoading}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-slate-50 hover:bg-white disabled:opacity-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">メールアドレス <span className="text-red-500">*</span></label>
              <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com" disabled={isLoading}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-slate-50 hover:bg-white disabled:opacity-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">パスワード <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="6文字以上" disabled={isLoading}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-slate-50 hover:bg-white pr-10 disabled:opacity-50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">パスワード確認 <span className="text-red-500">*</span></label>
              <input type="password" value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="パスワードを再入力" disabled={isLoading}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-slate-50 hover:bg-white disabled:opacity-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ロール</label>
              <select value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 disabled:opacity-50">
                {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-2.5 px-4 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {isLoading ? '登録中...' : '新規登録'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              既にアカウントをお持ちの方は
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium ml-1">ログイン</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
