import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, TrendingUp, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { name: '總覽 Dashboard', path: '/', icon: LayoutDashboard },
  { name: '交易紀錄 History', path: '/history', icon: History },
  { name: '個股表現 Stock', path: '/stock', icon: TrendingUp },
  { name: '設定 Options', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <div className="w-20 hover:w-64 group h-screen bg-white dark:bg-[#0f4375] shadow-lg flex flex-col transition-all duration-300 ease-in-out relative z-50">
      <div className="p-4 h-20 flex items-center overflow-hidden whitespace-nowrap border-b border-transparent dark:border-[#06182b]">
        <h1 className="text-xl font-bold text-brand-dark dark:text-brand-light flex items-center gap-4 px-2">
          <TrendingUp className="w-7 h-7 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            股票記帳系統
          </span>
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-hidden overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap",
                isActive
                  ? "bg-brand/10 text-brand font-medium dark:bg-brand-light/20 dark:text-brand-light"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#06182b]/50"
              )}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-[#06182b] space-y-2 overflow-hidden whitespace-nowrap bg-white dark:bg-[#0f4375]">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-4 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#06182b]/50 transition-all"
        >
          {isDark ? <Sun className="w-6 h-6 flex-shrink-0" /> : <Moon className="w-6 h-6 flex-shrink-0" />}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            {isDark ? '切換淺色模式' : '切換深色模式'}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            登出系統
          </span>
        </button>
      </div>
    </div>
  );
}
