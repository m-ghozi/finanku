import React, { useState, useEffect } from 'react';
import { useNotifications, useMarkNotifRead, useMarkAllNotifRead } from '@/src/hooks/useNotifications';
import { PageHeader } from '@/src/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { LoadingState } from '@/src/components/shared/LoadingState';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { formatDate } from '@/src/lib/utils';
import { useRouter } from '@/src/lib/router';
import { Bell, CheckCheck, AlertTriangle, Clock, Target, ShieldCheck } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markReadMutation = useMarkNotifRead();
  const markAllMutation = useMarkAllNotifRead();
  const { navigate } = useRouter();

  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          new Notification('Finanku', {
            body: 'Notifikasi browser berhasil diaktifkan!',
            icon: '/icon.svg',
          });
        }
      } catch {
        // ignore
      }
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'budget_warning':
      case 'budget_exceeded':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'debt_due':
      case 'receivable_due':
        return <Clock className="h-4 w-4 text-rose-500" />;
      case 'saving_milestone':
        return <Target className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-sky-500" />;
    }
  };

  if (isLoading) return <LoadingState rows={4} />;

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Pusat Notifikasi"
        description="Pemberitahuan peringatan anggaran, jatuh tempo hutang/piutang, dan jadwal transaksi rutin."
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllMutation.mutate()}
              isLoading={markAllMutation.isPending}
              className="gap-1.5 text-xs"
            >
              <CheckCheck className="h-4 w-4" />
              Tandai Semua Dibaca
            </Button>
          ) : undefined
        }
      />

      {/* Browser Notification Banner */}
      <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Notifikasi Browser
              </h4>
              <p className="text-[11px] text-zinc-500">
                Status saat ini:{' '}
                <strong className={permission === 'granted' ? 'text-emerald-600' : 'text-zinc-600'}>
                  {permission === 'granted' ? 'Aktif' : permission === 'denied' ? 'Diblokir Browser' : 'Belum Diaktifkan'}
                </strong>
              </p>
            </div>
          </div>

          {permission !== 'granted' && (
            <Button
              size="sm"
              onClick={requestPermission}
              className="text-xs self-start sm:self-auto"
            >
              Aktifkan Notifikasi Browser
            </Button>
          )}
        </div>
      </Card>

      {/* Notification Items List */}
      {!notifications || notifications.length === 0 ? (
        <EmptyState
          title="Tidak Ada Notifikasi"
          description="Semua anggaran dan jadwal pembayaran Anda dalam kondisi aman terkendali."
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <Card
              key={item.id}
              className={`p-4 transition-all ${
                !item.isRead ? 'border-l-4 border-l-emerald-600 bg-white dark:bg-zinc-900' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0 mt-0.5">
                    {getNotifIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                      {item.message}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {formatDate(item.date, 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        markReadMutation.mutate(item.id);
                        navigate(item.link!);
                      }}
                      className="text-xs h-7 px-2"
                    >
                      Buka &rarr;
                    </Button>
                  )}
                  {!item.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(item.id)}
                      className="text-xs text-zinc-400 hover:text-zinc-700 p-1"
                      title="Tandai sudah dibaca"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
