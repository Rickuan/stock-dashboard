import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Lock } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '000') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brand-darkest p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#0f4375] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 dark:bg-brand-light/20 text-brand dark:text-brand-light mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">系統登入</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-2">請輸入您的帳號密碼</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              帳號
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#06182b] bg-slate-50 dark:bg-[#06182b] dark:text-white focus:ring-2 focus:ring-brand dark:focus:ring-brand-light outline-none transition-all"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              密碼
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#06182b] bg-slate-50 dark:bg-[#06182b] dark:text-white focus:ring-2 focus:ring-brand dark:focus:ring-brand-light outline-none transition-all pl-10"
                placeholder="000"
                required
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors duration-200 shadow-md shadow-brand/20 dark:bg-brand-light dark:text-brand-darkest dark:hover:bg-brand-light/90"
          >
            登入 Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
