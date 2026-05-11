'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save, Globe } from 'lucide-react';

export default function AboutEditorPage() {
  const [languages, setLanguages] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: langs } = await supabase.from('languages').select('*').order('is_default', { ascending: false });
      setLanguages(langs || []);

      const { data: section } = await supabase.from('sections').select('id').eq('name', 'about').single();
      if (section) {
        const { data: contentKeys } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
        setKeys(contentKeys || []);

        const { data: trans } = await supabase.from('translations').select('*').in('content_key_id', (contentKeys || []).map(k => k.id));
        const transMap: Record<string, string> = {};
        trans?.forEach(t => { transMap[`${t.content_key_id}_${t.language_id}`] = t.value || ''; });
        setTranslations(transMap);
      }
    } catch (error: any) {
      toast.error('Failed to load data');
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
      toast.success('Saved successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About Us Editor</h1>
        <p className="text-slate-500">Edit the mission and vision statements.</p>
      </div>

      <Tabs defaultValue={languages[0]?.id}>
        <TabsList className="mb-8">
          {languages.map(lang => (
            <TabsTrigger key={lang.id} value={lang.id} className="gap-2">
              <Globe className="w-4 h-4" /> {lang.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {languages.map(lang => (
          <TabsContent key={lang.id} value={lang.id}>
            <Card className="border-slate-200">
              <CardHeader><CardTitle>{lang.name} Content</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {keys.map(key => (
                  <div key={key.id} className="space-y-2">
                    <Label className="capitalize font-semibold">{key.key.replace('_', ' ')}</Label>
                    {key.field_type === 'textarea' ? (
                      <Textarea 
                        value={translations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                        className="bg-white"
                      />
                    ) : (
                      <Input 
                        value={translations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                        className="bg-white"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end bg-slate-50/50 p-4">
                <Button onClick={() => handleSave(lang.id)} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
