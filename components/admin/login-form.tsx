'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Succesvol ingelogd');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Inloggen mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <Card className="w-full max-w-[440px] border-none shadow-2xl shadow-black/5 bg-card rounded-[32px] overflow-hidden">
        <CardHeader className="pt-12 pb-8 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <Image src="/viesa-logo.png" alt="VIESA" width={48} height={48} className="object-contain" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-display font-bold text-foreground tracking-tight">Admin <span className="text-primary">Portal</span></CardTitle>
            <CardDescription className="text-muted-foreground mt-2 font-medium">Log in om uw website te beheren</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">E-mailadres</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <Input 
                  type="email"
                  placeholder="admin@viesa-automations.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:border-primary text-foreground font-medium placeholder:text-muted-foreground transition-all shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Wachtwoord</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:border-primary text-foreground font-medium placeholder:text-muted-foreground transition-all shadow-inner"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Inloggen
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-12 pt-4 justify-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
            VIESA AUTOMATIONS &copy; {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
