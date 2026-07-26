'use client';

import { useAuth } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, hasAccess } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          <p className="text-sm font-medium text-slate-400">Loading DenTrack Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasAccess(pathname)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          Your account role (<span className="font-semibold text-slate-800">{user?.role}</span>) does not have authorization to view <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{pathname}</span>.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
