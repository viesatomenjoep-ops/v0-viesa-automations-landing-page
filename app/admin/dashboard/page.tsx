'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    languages: 3,
    sections: 7,
    assets: 0,
    recentEdits: []
  });
  const supabase = createClient();

  useEffect(() => {
    async function getStats() {
      const { count: langCount } = await supabase.from('languages').select('*', { count: 'exact', head: true });
      const { count: secCount } = await supabase.from('sections').select('*', { count: 'exact', head: true });
      const { data: assets } = await supabase.storage.from('cms-assets').list();
      
      setStats({
        languages: langCount || 3,
        sections: secCount || 7,
        assets: assets?.length || 0,
        recentEdits: [
          { title: 'Hero Sectie', time: '2 min. geleden', author: 'Joep' },
          { title: 'Over Ons', time: '1 uur geleden', author: 'Joep' },
          { title: 'Diensten Grid', time: '3 uur geleden', author: 'Joep' },
        ] as any
      });
    }
    getStats();
  }, []);

  return (
    <div className="py-8 px-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overzicht Dashboard</h1>
          <p className="text-slate-500">Beheer uw content en monitor systeemprestaties.</p>
        </div>
        <Button onClick={() => router.push('/admin/editor')} className="rounded-2xl bg-primary text-white font-bold h-12 px-8 shadow-lg shadow-primary/20">
          Website Content Bewerken
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white group hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Talen</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.languages} Actief</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white group hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secties</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.sections} Beheerd</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white group hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Media Assets</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.assets} Bestanden</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white group hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
              <h3 className="text-2xl font-bold text-slate-900">Optimaal</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Taalverdeling</CardTitle>
              <CardDescription>Contentdekking over verschillende talen.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-slate-100">
              Rapport Bekijken
            </Button>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="h-64 flex items-end gap-6 pt-8">
              <div className="flex-1 flex flex-col items-center gap-3">
                 <div className="w-full bg-primary rounded-t-2xl transition-all hover:bg-primary/80" style={{ height: '95%' }} />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nederlands</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                 <div className="w-full bg-primary/40 rounded-t-2xl transition-all hover:bg-primary/60" style={{ height: '60%' }} />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engels</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                 <div className="w-full bg-primary/20 rounded-t-2xl transition-all hover:bg-primary/40" style={{ height: '40%' }} />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Spaans</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-xl">Recente Activiteit</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            {stats.recentEdits.map((edit: any, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{edit.title}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{edit.time} door {edit.author}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors" />
              </div>
            ))}
            
            <div className="pt-4">
               <div className="p-6 bg-blue-50 rounded-[24px] border border-blue-100/50 space-y-3">
                  <h4 className="text-sm font-bold text-blue-900">Systeem Tip</h4>
                  <p className="text-xs text-blue-700/80 leading-relaxed">
                    Zorg ervoor dat alle Spaanse vertalingen voltooid zijn voor de marktintroductie volgende week.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-blue-600 font-bold text-xs">
                    Taken bekijken &rarr;
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
