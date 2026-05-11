import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/admin/login-form';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="admin-theme bg-white min-h-screen">
        <LoginForm />
        <Toaster position="top-right" />
      </div>
    );
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="admin-theme">
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-white border-b border-slate-50 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-primary transition-colors" />
            <div className="h-6 w-[1px] bg-slate-100 mx-2" />
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Admin <span className="text-primary">Dashboard</span></h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Welkom terug, {user.email?.split('@')[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
              <Image src="/viesa-logo.png" alt="VIESA" width={24} height={24} className="object-contain" />
            </div>
          </div>
        </header>
        <main className="flex-1 bg-white">
          {children}
        </main>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
