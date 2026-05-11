'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  User,
  Bell
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';

const navItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Content Editor',
    url: '/admin/editor',
    icon: FileText,
  },
  {
    title: 'Media Bestanden',
    url: '/admin/media',
    icon: ImageIcon,
  },
  {
    title: 'Instellingen',
    url: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Succesvol uitgelogd');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-100 bg-white">
      <SidebarHeader className="h-20 flex items-center px-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Image src="/viesa-logo.png" alt="Logo" width={24} height={24} className="object-contain" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display font-bold text-slate-900 tracking-tight leading-none">VIESA</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Automations</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Hoofdmenu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    onClick={() => router.push(item.url)}
                    tooltip={item.title}
                    className={`h-12 rounded-2xl px-4 transition-all duration-300 ${pathname === item.url
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary hover:text-white'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 ${pathname === item.url ? 'text-white' : ''}`} />
                    <span className="font-semibold">{item.title}</span>
                    {pathname === item.url && (
                      <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* User Profile info like the reference image */}
        <div className="group-data-[collapsible=icon]:hidden p-4 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 truncate">{user?.email?.split('@')[0] || 'Admin'}</span>
            <span className="text-[10px] font-medium text-slate-500">Systeembeheerder</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="group-data-[collapsible=icon]:hidden font-semibold">Uitloggen</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
