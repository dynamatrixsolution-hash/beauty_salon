'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Scissors,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import SessionProvider from '@/components/providers/SessionProvider';

const SIDEBAR_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // If we're on the login page, render children without admin chrome
  const isLoginPage = pathname === '/admin/login';
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-charcoal-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" />
          <p className="text-white/60 text-sm font-sans">Loading...</p>
        </div>
      </div>
    );
  }


  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-brand-charcoal-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" />
          <p className="text-white/60 text-sm font-sans">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-brand-charcoal-dark flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-charcoal border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark font-serif text-lg font-bold shadow-lg">
            G
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-brand-gold animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base font-semibold tracking-wider text-white">
              GLOW & GRACE
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-brand-rosegold font-medium -mt-0.5">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-brand-rosegold/15 text-brand-rosegold border border-brand-rosegold/20'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] transition-colors ${
                        isActive
                          ? 'text-brand-rosegold'
                          : 'text-white/40 group-hover:text-white/80'
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info & Sign out */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-rosegold to-brand-pink-accent flex items-center justify-center text-brand-charcoal-dark font-semibold text-xs">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-white font-medium truncate">
                {session?.user?.name || 'Admin'}
              </span>
              <span className="text-[11px] text-white/40 truncate">
                {session?.user?.email || ''}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-brand-charcoal-dark/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Page title from pathname */}
            <div className="hidden lg:block">
              <h1 className="text-lg font-serif font-semibold text-white tracking-wide">
                {SIDEBAR_ITEMS.find((item) =>
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname?.startsWith(item.href)
                )?.label || 'Admin'}
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-xs text-white/40 hover:text-brand-rosegold transition-colors px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-brand-rosegold/30"
              >
                View Site →
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
