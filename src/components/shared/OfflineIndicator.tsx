import React from 'react';
import { useOnlineStatus } from '@/src/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-in slide-in-from-bottom-2">
      <WifiOff className="h-3.5 w-3.5" />
      <span>Mode Offline — Menampilkan data tersimpan.</span>
    </div>
  );
};
