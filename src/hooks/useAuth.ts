import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ nama: string; role: string; email: string } | null>(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('spms-user') : null;
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, password: string) => {
    if (email && password) {
      const u = { nama: 'M. Yusuf Badru Tamam', role: 'Super Admin', email };
      setUser(u);
      sessionStorage.setItem('spms-user', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('spms-user');
  }, []);

  return { user, login, logout };
}
