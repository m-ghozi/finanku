import { useState, useEffect } from 'react';

const STORAGE_KEY = 'finanku_hide_balance';

export function getInitialPrivacyState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPrivacyState(hide: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, hide ? 'true' : 'false');
    window.dispatchEvent(new Event('finanku_privacy_change'));
  } catch {
    // ignore
  }
}

export function useBalancePrivacy() {
  const [isHidden, setIsHidden] = useState<boolean>(getInitialPrivacyState);

  useEffect(() => {
    const handleStorage = () => {
      setIsHidden(getInitialPrivacyState());
    };

    window.addEventListener('finanku_privacy_change', handleStorage);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('finanku_privacy_change', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggle = () => {
    const next = !isHidden;
    setIsHidden(next);
    setPrivacyState(next);
  };

  return { isHidden, toggle, setHidden: (val: boolean) => { setIsHidden(val); setPrivacyState(val); } };
}
