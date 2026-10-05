import React, { useState, useEffect } from 'react';
import { useCurrentUser, useLogout } from '@/src/hooks/useAuth';
import { useBalancePrivacy } from '@/src/lib/privacy';
import { useRouter } from '@/src/lib/router';
import { PageHeader } from '@/src/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { PWAInstallButton } from '@/src/components/shared/PWAInstallButton';
import { User, Bell, Shield, Sliders, Moon, Sun, Monitor, LogOut, Eye, EyeOff } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const { isHidden, toggle: togglePrivacy } = useBalancePrivacy();
  const { navigate } = useRouter();

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Budi Santoso');
  const [email, setEmail] = useState(user?.email || 'user@finanku.id');
  const [savedMessage, setSavedMessage] = useState('');

  // Preference state
  const [currency, setCurrency] = useState('IDR');
  const [language, setLanguage] = useState('id');
  const [dateFormat, setDateFormat] = useState('dd MMM yyyy');
  const [startOfWeek, setStartOfWeek] = useState('Senin');

  // Appearance state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Profil berhasil diperbarui!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/login');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      <PageHeader
        title="Pengaturan Akun & Preferensi"
        description="Kelola informasi akun pengguna, tampilan antarmuka, format finansial, dan privasi."
      />

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Profil Pengguna</CardTitle>
          </div>
          <p className="text-xs text-zinc-500">Informasi identitas pribadi Anda</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Lengkap
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Alamat Email
              </label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {savedMessage && (
              <p className="text-xs text-emerald-600 font-semibold">{savedMessage}</p>
            )}

            <Button type="submit" size="sm">
              Simpan Profil
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Preferensi Finansial & Wilayah</CardTitle>
          </div>
          <p className="text-xs text-zinc-500">Mata uang, bahasa aplikasi, dan format tanggal</p>
        </CardHeader>
        <CardContent className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Mata Uang (Currency)
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="IDR">IDR (Rupiah - Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Bahasa
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Format Tanggal
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="dd MMM yyyy">05 Okt 2026</option>
                <option value="dd/MM/yyyy">05/10/2026</option>
                <option value="yyyy-MM-dd">2026-10-05</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Awal Hari Pekan (Start of Week)
              </label>
              <select
                value={startOfWeek}
                onChange={(e) => setStartOfWeek(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="Senin">Senin</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Privacy Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Privasi Finansial</CardTitle>
          </div>
          <p className="text-xs text-zinc-500">Sembunyikan nominal saldo saat berada di tempat umum</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                {isHidden ? <EyeOff className="h-4 w-4 text-emerald-600" /> : <Eye className="h-4 w-4 text-zinc-500" />}
                Mode Sensor Saldo (Hide Balance)
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {isHidden
                  ? 'Aktif — Nominal saldo disamarkan menjadi "Rp ••••••••"'
                  : 'Nonaktif — Nominal saldo ditampilkan normal'}
              </p>
            </div>
            <Button
              variant={isHidden ? 'default' : 'outline'}
              size="sm"
              onClick={togglePrivacy}
              className="text-xs"
            >
              {isHidden ? 'Matikan Sensor' : 'Aktifkan Sensor'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PWA & Application Shell */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Aplikasi Web Progresif (PWA)</CardTitle>
          <p className="text-xs text-zinc-500">Pasang Finanku sebagai aplikasi native di perangkat Anda</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Mendukung akses offline, peluncuran layar utama, dan respons cepat.
            </p>
            <PWAInstallButton />
          </div>
        </CardContent>
      </Card>

      {/* Security & Logout */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-600" />
            <CardTitle className="text-base font-semibold">Keamanan & Sesi</CardTitle>
          </div>
          <p className="text-xs text-zinc-500">Kelola status sesi login Anda saat ini</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500">Tipe Autentikasi:</span>
            <Badge variant="outline">Mock JWT Bearer Session</Badge>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500">Status Penyimpanan Data:</span>
            <span className="font-semibold text-emerald-600">Local Browser Encrypted Storage</span>
          </div>

          <div className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              isLoading={logoutMutation.isPending}
              className="gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Keluar dari Sesi (Logout)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
