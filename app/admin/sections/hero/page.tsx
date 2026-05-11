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

interface Translation {
  content_key_id: string;
  language_id: string;
  value: string;
}

export default function HeroEditorPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [keys, setKeys] = useState<ContentKey[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // 1. Fetch Languages
      const { data: langs, error: langError } = await supabase
        .from('languages')
        .select('*')
        .order('is_default', { ascending: false });
      
      if (langError) throw langError;
      setLanguages(langs);

      // 2. Fetch Hero Section ID and its Keys
      const { data: section, error: secError } = await supabase
        .from('sections')
        .select('id')
        .eq('name', 'hero')
        .single();
      
      if (secError) throw secError;

      const { data: contentKeys, error: keysError } = await supabase
        .from('content_keys')
        .select('*')
        .eq('section_id', section.id);
      
      if (keysError) throw keysError;
      setKeys(contentKeys);

      // 3. Fetch existing translations
      const { data: trans, error: transError } = await supabase
        .from('translations')
        .select('*')
        .in('content_key_id', contentKeys.map(k => k.id));
      
      if (transError) throw transError;

      const transMap: Record<string, string> = {};
      trans.forEach(t => {
        transMap[`${t.content_key_id}_${t.language_id}`] = t.value || '';
      });
      setTranslations(transMap);

    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (keyId: string, langId: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [`${keyId}_${langId}`]: value
    }));
  };

  const handleSave = async (langId: string) => {
    setIsSaving(true);
    try {
      const updates = keys.map(key => ({
        content_key_id: key.id,
        language_id: langId,
        value: translations[`${key.id}_${langId}`] || ''
      }));

      const { error } = await supabase
        .from('translations')
        .upsert(updates, { onConflict: 'content_key_id,language_id' });

      if (error) throw error;
      toast.success('Changes saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hero Section Editor</h1>
        <p className="text-slate-500">Manage titles, descriptions, and CTAs across all languages.</p>
      </div>

      <Tabs defaultValue={languages[0]?.id} className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-8">
          {languages.map(lang => (
            <TabsTrigger key={lang.id} value={lang.id} className="gap-2">
              <Globe className="w-4 h-4" />
              {lang.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {languages.map(lang => (
          <TabsContent key={lang.id} value={lang.id}>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>{lang.name} Content</CardTitle>
                <CardDescription>Edit the hero section in {lang.name.toLowerCase()}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {keys.map(key => (
                  <div key={key.id} className="space-y-2">
                    <Label className="capitalize font-semibold">{key.key.replace('_', ' ')}</Label>
                    {key.field_type === 'textarea' ? (
                      <Textarea 
                        value={translations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                        placeholder={`Enter ${key.key}...`}
                        rows={4}
                        className="bg-white"
                      />
                    ) : (
                      <Input 
                        value={translations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => handleInputChange(key.id, lang.id, e.target.value)}
                        placeholder={`Enter ${key.key}...`}
                        className="bg-white"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-slate-50/50 flex justify-end p-4">
                <Button 
                  onClick={() => handleSave(lang.id)} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save {lang.name} Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
