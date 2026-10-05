import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | '/dashboard'
  | '/transactions'
  | '/accounts'
  | '/categories'
  | '/budgets'
  | '/savings'
  | '/debts'
  | '/recurring'
  | '/reports'
  | '/financial-planning'
  | '/notifications'
  | '/settings'
  | '/login';

interface RouterContextType {
  pathname: AppRoute;
  navigate: (to: string) => void;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType | null>(null);

function normalizePath(path: string): AppRoute {
  // Strip trailing slashes and hash
  let clean = path.split('?')[0].split('#')[0];
  if (clean === '/' || !clean) return '/dashboard';
  if (!clean.startsWith('/')) clean = `/${clean}`;

  const validRoutes: AppRoute[] = [
    '/dashboard',
    '/transactions',
    '/accounts',
    '/categories',
    '/budgets',
    '/savings',
    '/debts',
    '/recurring',
    '/reports',
    '/financial-planning',
    '/notifications',
    '/settings',
    '/login',
  ];

  if (validRoutes.includes(clean as AppRoute)) {
    return clean as AppRoute;
  }
  return '/dashboard';
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/dashboard';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname));
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    const target = normalizePath(to);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', to);
      setPathname(target);
      setSearchParams(new URLSearchParams(to.includes('?') ? to.split('?')[1] : ''));
    }
  };

  return (
    <RouterContext.Provider value={{ pathname, navigate, searchParams }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
