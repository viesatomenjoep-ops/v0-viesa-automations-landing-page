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
import { Loader2, Save, Globe, Plus, Trash2, GripVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Language {
  id: string;
  code: string;
  name: string;
}

interface ServiceItem {
  id: string;
  icon_name: string;
  sort_order: number;
  translations: Record<string, { title: string, description: string }>;
}

export default function ServicesEditorPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [headerKeys, setHeaderKeys] = useState<any[]>([]);
  const [headerTranslations, setHeaderTranslations] = useState<Record<string, string>>({});
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // 1. Fetch Languages
      const { data: langs } = await supabase.from('languages').select('*').order('is_default', { ascending: false });
      setLanguages(langs || []);

      // 2. Fetch Header Content
      const { data: section } = await supabase.from('sections').select('id').eq('name', 'services').single();
      if (section) {
        const { data: keys } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
        setHeaderKeys(keys || []);
        
        const { data: trans } = await supabase.from('translations').select('*').in('content_key_id', (keys || []).map(k => k.id));
        const transMap: Record<string, string> = {};
        trans?.forEach(t => {
          transMap[`${t.content_key_id}_${t.language_id}`] = t.value || '';
        });
        setHeaderTranslations(transMap);

        // 3. Fetch Service Items
        const { data: items } = await supabase.from('service_items').select('*').order('sort_order', { ascending: true });
        const { data: itemTrans } = await supabase.from('service_item_translations').select('*');
        
        const itemsWithTrans = (items || []).map(item => {
          const transObj: Record<string, { title: string, description: string }> = {};
          itemTrans?.filter(it => it.service_item_id === item.id).forEach(it => {
            transObj[it.language_id] = { title: it.title || '', description: it.description || '' };
          });
          return { ...item, translations: transObj };
        });
        setServiceItems(itemsWithTrans);
      }
    } catch (error: any) {
      toast.error('Failed to load services data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleHeaderChange = (keyId: string, langId: string, value: string) => {
    setHeaderTranslations(prev => ({ ...prev, [`${keyId}_${langId}`]: value }));
  };

  const handleItemChange = (itemId: string, langId: string, field: 'title' | 'description', value: string) => {
    setServiceItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          translations: {
            ...item.translations,
            [langId]: { ...(item.translations[langId] || { title: '', description: '' }), [field]: value }
          }
        };
      }
      return item;
    }));
  };

  const saveHeader = async (langId: string) => {
    setIsSaving(true);
    try {
      const updates = headerKeys.map(key => ({
        content_key_id: key.id,
        language_id: langId,
        value: headerTranslations[`${key.id}_${langId}`] || ''
      }));
      await supabase.from('translations').upsert(updates, { onConflict: 'content_key_id,language_id' });
      toast.success('Header saved');
    } finally {
      setIsSaving(false);
    }
  };

  const saveItems = async (langId: string) => {
    setIsSaving(true);
    try {
      const updates = serviceItems.map(item => ({
        service_item_id: item.id,
        language_id: langId,
        title: item.translations[langId]?.title || '',
        description: item.translations[langId]?.description || ''
      }));
      await supabase.from('service_item_translations').upsert(updates, { onConflict: 'service_item_id,language_id' });
      toast.success('Items saved');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services Grid Editor</h1>
        <p className="text-slate-500">Manage the bento-box services grid and its header.</p>
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
          <TabsContent key={lang.id} value={lang.id} className="space-y-12">
            {/* Header Editor */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Section Header ({lang.code.toUpperCase()})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {headerKeys.map(key => (
                  <div key={key.id} className="space-y-2">
                    <Label className="capitalize">{key.key.replace('header_', '')}</Label>
                    {key.field_type === 'textarea' ? (
                      <Textarea 
                        value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => handleHeaderChange(key.id, lang.id, e.target.value)}
                        className="bg-white"
                      />
                    ) : (
                      <Input 
                        value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => handleHeaderChange(key.id, lang.id, e.target.value)}
                        className="bg-white"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end bg-slate-50/50 p-4">
                <Button onClick={() => saveHeader(lang.id)} disabled={isSaving} size="sm">Save Header</Button>
              </CardFooter>
            </Card>

            {/* Items Editor */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Service Items</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add New Item
                </Button>
              </div>

              {serviceItems.map((item, idx) => (
                <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex">
                    <div className="w-12 bg-slate-50 flex items-center justify-center border-r border-slate-100 cursor-grab">
                      <GripVertical className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {idx + 1}
                          </div>
                          <Input 
                            value={item.icon_name}
                            onChange={(e) => {}} // Handle icon change
                            className="w-32 h-8 text-xs font-mono"
                            placeholder="Icon Name"
                          />
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Title ({lang.code})</Label>
                          <Input 
                            value={item.translations[lang.id]?.title || ''}
                            onChange={(e) => handleItemChange(item.id, lang.id, 'title', e.target.value)}
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Description ({lang.code})</Label>
                          <Textarea 
                            value={item.translations[lang.id]?.description || ''}
                            onChange={(e) => handleItemChange(item.id, lang.id, 'description', e.target.value)}
                            className="bg-white"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => saveItems(lang.id)} disabled={isSaving} className="gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save All {lang.name} Items
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
