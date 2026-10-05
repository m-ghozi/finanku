import React, { useState } from 'react';
import { useLogin } from '@/src/hooks/useAuth';
import { useRouter } from '@/src/lib/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { ShieldCheck, LogIn, Lock, Mail } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('user@fintrack.id');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useLogin();
  const { navigate } = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Email wajib diisi');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate('/dashboard');
    } catch {
      setErrorMsg('Gagal masuk. Periksa email atau kata sandi Anda.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-md">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Fintrack
          </h1>
          <p className="text-xs text-zinc-500">
            Aplikasi Pengelolaan Keuangan Pribadi
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 shadow-lg border-zinc-200/80 dark:border-zinc-800">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-semibold">Masuk ke Akun Anda</CardTitle>
            <p className="text-xs text-zinc-500">Gunakan akun demo atau kredensial Anda</p>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                isLoading={loginMutation.isPending}
              >
                <LogIn className="h-4 w-4" />
                Masuk (Login)
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials hint */}
        <div className="p-3 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-[11px] text-zinc-500 text-center">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">Mode Demo Stand-Alone</p>
          <p>Kredensial otomatis terisi: <strong>user@fintrack.id</strong> / <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
};
