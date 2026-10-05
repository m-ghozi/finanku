import React, { useState } from 'react';
import { useRouter, AppRoute } from '@/src/lib/router';
import { cn } from '@/src/lib/utils';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Wallet,
  Menu,
  X,
  PieChart,
  Target,
  Scale,
  Repeat,
  BarChart3,
  CalendarCheck2,
  Tag,
  Settings,
  Bell,
} from 'lucide-react';

interface MobileNavProps {
  onOpenCreateTransaction: () => void;
  onOpenQuickInput: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOpenCreateTransaction,
  onOpenQuickInput,
}) => {
  const { pathname, navigate } = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: 'Transaksi', href: '/transactions', icon: <ArrowLeftRight className="h-5 w-5" /> },
    {
      title: 'Tambah',
      isAction: true,
      icon: <Plus className="h-5 w-5" />,
    },
    { title: 'Rekening', href: '/accounts', icon: <Wallet className="h-5 w-5" /> },
    {
      title: 'Lainnya',
      isMore: true,
      icon: <Menu className="h-5 w-5" />,
    },
  ];

  const moreMenuItems: { title: string; href: AppRoute; icon: React.ReactNode }[] = [
    { title: 'Anggaran (Budgets)', href: '/budgets', icon: <PieChart className="h-4 w-4" /> },
    { title: 'Target Tabungan', href: '/savings', icon: <Target className="h-4 w-4" /> },
    { title: 'Hutang & Piutang', href: '/debts', icon: <Scale className="h-4 w-4" /> },
    { title: 'Transaksi Berulang', href: '/recurring', icon: <Repeat className="h-4 w-4" /> },
    { title: 'Laporan & Net Worth', href: '/reports', icon: <BarChart3 className="h-4 w-4" /> },
    { title: 'Financial Planning', href: '/financial-planning', icon: <CalendarCheck2 className="h-4 w-4" /> },
    { title: 'Kategori', href: '/categories', icon: <Tag className="h-4 w-4" /> },
    { title: 'Notifikasi', href: '/notifications', icon: <Bell className="h-4 w-4" /> },
    { title: 'Pengaturan', href: '/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs px-2 shadow-lg">
        {mainNavItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={onOpenCreateTransaction}
                className="flex -mt-5 h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
                aria-label="Tambah Transaksi Cepat"
              >
                <Plus className="h-6 w-6" />
              </button>
            );
          }

          if (item.isMore) {
            return (
              <button
                key={idx}
                onClick={() => setShowMoreMenu(true)}
                className="flex flex-col items-center justify-center gap-1 w-14 py-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer"
              >
                <Menu className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">Lainnya</span>
              </button>
            );
          }

          const isActive = pathname === item.href;
          return (
            <button
              key={idx}
              onClick={() => navigate(item.href as string)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-14 py-1 transition cursor-pointer',
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              )}
            >
              {item.icon}
              <span className="text-[10px] leading-none">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* More Menu Bottom Sheet on Mobile */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div
            className="flex-1"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative w-full rounded-t-2xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Menu Finansial
              </h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick text input option on mobile */}
            <div className="py-3 border-b border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenQuickInput();
                }}
                className="flex items-center justify-between w-full p-2.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-medium cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  ⚡ Quick Input Text ('makan siang 35000')
                </span>
                <span className="text-[11px] underline">Coba &rarr;</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3">
              {moreMenuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setShowMoreMenu(false);
                    navigate(item.href);
                  }}
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-lg text-left text-xs font-medium transition cursor-pointer',
                    pathname === item.href
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  <span className="text-zinc-500">{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
