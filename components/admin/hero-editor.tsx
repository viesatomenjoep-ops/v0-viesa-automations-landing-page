'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save, Globe } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Language {
  id: string;
  code: string;
  name: string;
}

interface ContentKey {
  id: string;
  key: string;
  field_type: string;
}

export function HeroEditor({ languages }: { languages: Language[] }) {
  const [keys, setKeys] = useState<ContentKey[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchHeroData();
    if (languages.length > 0) setActiveTab(languages[0].id);
  }, [languages]);

  async function fetchHeroData() {
    try {
      const { data: section } = await supabase.from('sections').select('id').eq('name', 'hero').single();
      if (!section) return;

      const { data: contentKeys } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
      setKeys(contentKeys || []);

      const { data: trans } = await supabase.from('translations').select('*').in('content_key_id', (contentKeys || []).map(k => k.id));
      const transMap: Record<string, string> = {};
      trans?.forEach(t => {
        transMap[`${t.content_key_id}_${t.language_id}`] = t.value || '';
      });
      setTranslations(transMap);
    } catch (error) {
      toast.error('Failed to load hero data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (keyId: string, langId: string, value: string) => {
    setTranslations(prev => ({ ...prev, [`${keyId}_${langId}`]: value }));
  };

  const handleSave = async (langId: string) => {
    setIsSaving(true);
    try {
      const updates = keys.map(key => ({
        content_key_id: key.id,
        language_id: langId,
        value: translations[`${key.id}_${langId}`] || ''
      }));

      const { error } = await supabase.from('translations').upsert(updates, { onConflict: 'content_key_id,language_id' });
      if (error) throw error;
      toast.success('Hero sectie opgeslagen');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 md:px-8 pt-6 md:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-50 pb-6 gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-50 text-primary rounded-2xl shrink-0">
                <Globe className="w-5 h-5" />
             </div>
             <div>
                <CardTitle className="text-xl">Hero Content</CardTitle>
                <CardDescription>Bewerk koppen en knoppen.</CardDescription>
             </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="sm:hidden w-full">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl font-bold h-11 text-primary">
                  <SelectValue placeholder="Taal selecteren" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 rounded-xl">
                  {languages.map(l => (
                    <SelectItem key={l.id} value={l.id} className="font-bold">{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden sm:flex bg-slate-100 p-1 rounded-xl">
              {languages.map(lang => (
                <TabsTrigger 
                  key={lang.id} 
                  value={lang.id} 
                  className="rounded-lg px-6 py-2 transition-all font-bold text-slate-500 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                >
                  {lang.code.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {languages.map(lang => (
          <TabsContent key={lang.id} value={lang.id} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               {keys.filter(k => k.field_type !== 'textarea').map(key => (
                 <div key={key.id} className="space-y-3 w-full">
                   <Label className="text-xs font-bold uppercase tracking-widest text-primary">{key.key.replace('_', ' ')}</Label>
                   <Input 
                     value={translations[`${key.id}_${lang.id}`] || ''}
                     onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                     className="h-12 rounded-2xl bg-white border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                   />
                 </div>
               ))}
            </div>
            
            {keys.filter(k => k.field_type === 'textarea').map(key => (
              <div key={key.id} className="space-y-3 w-full">
                <Label className="text-xs font-bold uppercase tracking-widest text-primary">{key.key.replace('_', ' ')}</Label>
                <Textarea 
                  value={translations[`${key.id}_${lang.id}`] || ''}
                  onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                  className="rounded-2xl bg-white border-primary/20 focus:border-primary text-primary font-bold shadow-sm min-h-[120px] w-full"
                />
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => handleSave(lang.id)} 
                disabled={isSaving}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {lang.name} Opslaan
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
