import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface RouterState {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterState | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/dashboard';
    return window.location.hash.replace('#', '') || '/dashboard';
  });

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
