'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, Globe, Users, Database } from 'lucide-react';
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

export function AboutEditor({ languages }: { languages: Language[] }) {
  const [keys, setKeys] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    if (languages && languages.length > 0) {
      setActiveTab(languages[0].id);
      fetchData();
    }
  }, [languages]);

  async function fetchData() {
    setIsLoading(true);
    try {
      let { data: section } = await supabase.from('sections').select('id').eq('name', 'about').single();

      if (!section) {
        const { data: newSection, error: secErr } = await supabase
          .from('sections')
          .insert({ name: 'about', display_name: 'Over Ons' })
          .select()
          .single();
        if (secErr) throw secErr;
        section = newSection;
      }

      const { data: contentKeys } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
      setKeys(contentKeys || []);

      if (contentKeys && contentKeys.length > 0) {
        const { data: trans } = await supabase.from('translations').select('*').in('content_key_id', contentKeys.map(k => k.id));
        const transMap: Record<string, string> = {};
        trans?.forEach(t => { transMap[`${t.content_key_id}_${t.language_id}`] = t.value || ''; });
        setTranslations(transMap);
      }
    } catch (error: any) {
      console.error('About Editor Error:', error);
      toast.error('Fout bij ophalen data');
    } finally {
      setIsLoading(false);
    }
  }

  const initializeAboutSection = async () => {
    setIsSaving(true);
    try {
      let { data: section } = await supabase.from('sections').select('id').eq('name', 'about').single();
      if (!section) {
        const { data: newSection } = await supabase.from('sections').insert({ name: 'about', display_name: 'Over Ons' }).select().single();
        section = newSection;
      }

      if (!section) throw new Error("Could not find or create 'about' section");

      const targetKeys = [
        { key: 'about.title', type: 'input' },
        { key: 'about.title_accent', type: 'input' },
        { key: 'about.description_p1', type: 'textarea' },
        { key: 'about.description_p2', type: 'textarea' },
        { key: 'about.description_p3', type: 'textarea' },
      ];

      for (const tk of targetKeys) {
        const { data: existingKey } = await supabase.from('content_keys').select('id').eq('section_id', section.id).eq('key', tk.key).single();

        let keyId = existingKey?.id;
        if (!keyId) {
          const { data: newKey, error: keyErr } = await supabase.from('content_keys').insert({ section_id: section.id, key: tk.key, field_type: tk.type }).select().single();
          if (keyErr) throw keyErr;
          keyId = newKey.id;
        }

        const nlLang = languages.find(l => l.code === 'nl');
        if (nlLang) {
          const { data: existingTrans } = await supabase.from('translations').select('id').eq('content_key_id', keyId).eq('language_id', nlLang.id).single();

          if (!existingTrans) {
            const defaultContent: Record<string, string> = {
              'about.title': 'Technologie met een Visie',
              'about.title_accent': 'ons',
              'about.description_p1': 'Viesa Automations ontwikkelt innovatieve automatiseringsoplossingen en digitale platformen voor bedrijven die sneller, slimmer en efficiënter willen werken.',
              'about.description_p2': 'Met jarenlange ervaring in programmeren en softwareontwikkeling beschikt het team over diepgaande technische expertise. Daarnaast heeft Viesa een eigen AI-model ontwikkeld.',
              'about.description_p3': 'Viesa is actief binnen sectoren zoals retail & media, automotive, vastgoed, transport & logistiek, de equine sector en muziek & entertainment.',
            };
            await supabase.from('translations').insert({ content_key_id: keyId, language_id: nlLang.id, value: defaultContent[tk.key] || '' });
          }
        }
      }

      toast.success('Website content gesynchroniseerd!');
      await fetchData();
    } catch (error: any) {
      toast.error('Sync mislukt: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (keyId: string, langId: string, value: string) => {
    setTranslations(prev => ({ ...prev, [`${keyId}_${langId}`]: value }));
  };

  const handleSave = async (langId: string) => {
    setIsSaving(true);
    try {
      const activeKeyIds = keys
        .filter(key => ['about.title', 'about.title_accent', 'about.description_p1', 'about.description_p2', 'about.description_p3'].includes(key.key))
        .map(k => k.id);

      const updates = activeKeyIds.map(keyId => ({
        content_key_id: keyId,
        language_id: langId,
        value: translations[`${keyId}_${langId}`] || ''
      }));

      const { error } = await supabase.from('translations').upsert(updates, { onConflict: 'content_key_id,language_id' });
      if (error) throw error;
      toast.success('Wijzigingen opgeslagen');
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
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Over Ons Content</CardTitle>
              <CardDescription>Onze missie, visie en bedrijfsverhaal.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {keys.length < 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={initializeAboutSection}
                disabled={isSaving}
                className="hidden md:flex border-amber-100 text-amber-600 hover:bg-amber-50 rounded-xl h-10 gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Sync
              </Button>
            )}
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
              {['about.title', 'about.title_accent'].map(keyName => {
                const key = keys.find(k => k.key === keyName);
                if (!key) return null;
                return (
                  <div key={key.id} className="space-y-3 w-full">
                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">
                      {key.key === 'about.title' ? 'Hoofdtitel' : 'Accent Tekst'}
                    </Label>
                    <Input
                      value={translations[`${key.id}_${lang.id}`] || ''}
                      onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                      className="h-12 rounded-2xl bg-white border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                    />
                  </div>
                );
              })}
            </div>

            <div className="space-y-6">
              {['about.description_p1', 'about.description_p2', 'about.description_p3'].map(keyName => {
                const key = keys.find(k => k.key === keyName);
                if (!key) return null;
                return (
                  <div key={key.id} className="space-y-3 w-full">
                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">
                      {key.key === 'about.description_p1' ? 'Paragraaf 1' :
                        key.key === 'about.description_p2' ? 'Paragraaf 2' : 'Paragraaf 3'}
                    </Label>
                    <Textarea
                      value={translations[`${key.id}_${lang.id}`] || ''}
                      onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                      className="rounded-2xl bg-white border-primary/20 focus:border-primary text-primary font-bold shadow-sm min-h-[120px] w-full"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => handleSave(lang.id)}
                disabled={isSaving}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {lang.name} Opslaan
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
