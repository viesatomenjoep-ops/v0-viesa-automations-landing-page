'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Globe, Database, MessageCircle } from 'lucide-react';
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

// --- NAVIGATION EDITOR ---
export function NavigationEditor({ languages, menuType }: { languages: Language[], menuType: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
    if (languages.length > 0) setActiveTab(languages[0].id);
  }, [languages]);

  async function fetchItems() {
    try {
      const { data } = await supabase
        .from('navigation_items')
        .select(`
          *,
          translations:navigation_item_translations(*)
        `)
        .eq('menu_type', menuType)
        .order('sort_order', { ascending: true });

      const formatted = (data || []).map(item => ({
        ...item,
        translations: (item.translations || []).reduce((acc: any, t: any) => {
          acc[t.language_id] = { label: t.label };
          return acc;
        }, {} as any)
      }));
      setItems(formatted);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      toast.error('Fout bij ophalen navigatie');
    } finally {
      setIsLoading(false);
    }
  }

  const handleItemChange = (itemId: string, langId: string, field: string, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          translations: {
            ...item.translations,
            [langId]: { ...(item.translations[langId] || {}), [field]: value }
          }
        };
      }
      return item;
    }));
  };

  const handleUrlChange = (itemId: string, url: string) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, url } : item));
  };

  const addItem = async () => {
    const { data, error } = await supabase.from('navigation_items').insert({
      menu_type: menuType,
      url: '#',
      sort_order: items.length
    }).select().single();

    if (error) return toast.error('Fout bij toevoegen');

    setItems([...items, { ...data, translations: {} }]);
    toast.success('Link toegevoegd');
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('navigation_items').delete().eq('id', id);
    if (error) return toast.error('Fout bij verwijderen');
    setItems(items.filter(i => i.id !== id));
    toast.success('Link verwijderd');
  };

  const saveForLanguage = async (langId: string) => {
    setIsSaving(true);
    try {
      for (const item of items) {
        await supabase.from('navigation_items').update({ url: item.url }).eq('id', item.id);
      }

      const updates = items.map(item => ({
        navigation_item_id: item.id,
        language_id: langId,
        label: item.translations[langId]?.label || ''
      }));
      await supabase.from('navigation_item_translations').upsert(updates, { onConflict: 'navigation_item_id,language_id' });
      toast.success('Navigatie opgeslagen');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:hidden">Selecteer Taal</Label>
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
          <TabsList className="hidden sm:flex bg-slate-100 p-1 rounded-xl w-fit">
            {languages.map(l => (
              <TabsTrigger
                key={l.id}
                value={l.id}
                className="rounded-lg px-6 font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {l.code.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Button onClick={addItem} variant="outline" size="sm" className="w-full sm:w-auto rounded-xl border-primary/20 text-primary hover:bg-blue-50 transition-all h-11 sm:h-9">
          <Plus className="w-4 h-4 mr-2" /> Link Toevoegen
        </Button>
      </div>

      {languages.map(lang => (
        <TabsContent key={lang.id} value={lang.id} className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 md:p-6 bg-white rounded-[24px] border border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-md transition-all group relative">
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <div className="hidden md:block flex-1 w-[1px] bg-slate-100" />
                <Button
                  onClick={() => deleteItem(item.id)}
                  variant="ghost"
                  size="icon"
                  className="md:hidden ml-auto text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl h-10 w-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Label</Label>
                    <Input
                      value={item.translations[lang.id]?.label || ''}
                      onChange={(e) => handleItemChange(item.id, lang.id, 'label', e.target.value)}
                      className="bg-white rounded-xl h-11 border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                      placeholder="Naam van de link"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">URL / Anker (#)</Label>
                    <Input
                      value={item.url}
                      onChange={(e) => handleUrlChange(item.id, e.target.value)}
                      className="bg-white rounded-xl h-11 border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                      placeholder="#section or https://..."
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={() => deleteItem(item.id)}
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-300 hover:text-red-500 rounded-xl mt-6"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={() => saveForLanguage(lang.id)} disabled={isSaving} className="w-full sm:w-auto rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/10 bg-primary text-white">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {lang.name} Navigatie Opslaan
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// --- SERVICES EDITOR ---
export function ServicesEditor({ languages }: { languages: Language[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
    if (languages.length > 0) setActiveTab(languages[0].id);
  }, [languages]);

  async function fetchItems() {
    try {
      const { data: sItems } = await supabase.from('service_items').select('*').order('sort_order', { ascending: true });
      const { data: trans } = await supabase.from('service_item_translations').select('*');

      const formatted = (sItems || []).map(item => ({
        ...item,
        translations: (trans || []).filter(t => t.service_item_id === item.id).reduce((acc, t) => {
          acc[t.language_id] = { title: t.title, description: t.description };
          return acc;
        }, {} as any)
      }));
      setItems(formatted);
    } finally {
      setIsLoading(false);
    }
  }

  const handleItemChange = (itemId: string, langId: string, field: string, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          translations: {
            ...item.translations,
            [langId]: { ...(item.translations[langId] || {}), [field]: value }
          }
        };
      }
      return item;
    }));
  };

  const handleIconChange = (itemId: string, icon_name: string) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, icon_name } : item));
  };

  const addItem = async () => {
    const { data, error } = await supabase.from('service_items').insert({
      icon_name: 'Cpu',
      sort_order: items.length
    }).select().single();

    if (error) return toast.error('Fout bij toevoegen');

    setItems([...items, { ...data, translations: {} }]);
    toast.success('Dienst toegevoegd');
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('service_items').delete().eq('id', id);
    if (error) return toast.error('Fout bij verwijderen');
    setItems(items.filter(i => i.id !== id));
    toast.success('Dienst verwijderd');
  };

  const saveForLanguage = async (langId: string) => {
    setIsSaving(true);
    try {
      for (const item of items) {
        await supabase.from('service_items').update({ icon_name: item.icon_name }).eq('id', item.id);
      }

      const updates = items.map(item => ({
        service_item_id: item.id,
        language_id: langId,
        title: item.translations[langId]?.title || '',
        description: item.translations[langId]?.description || ''
      }));
      await supabase.from('service_item_translations').upsert(updates, { onConflict: 'service_item_id,language_id' });
      toast.success('Diensten opgeslagen');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:hidden">Selecteer Taal</Label>
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
          <TabsList className="hidden sm:flex bg-slate-100 p-1 rounded-xl w-fit">
            {languages.map(l => (
              <TabsTrigger
                key={l.id}
                value={l.id}
                className="rounded-lg px-6 font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {l.code.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Button onClick={addItem} variant="outline" size="sm" className="w-full sm:w-auto rounded-xl border-primary/20 text-primary hover:bg-blue-50 transition-all h-11 sm:h-9">
          <Plus className="w-4 h-4 mr-2" /> Dienst Toevoegen
        </Button>
      </div>

      {languages.map(lang => (
        <TabsContent key={lang.id} value={lang.id} className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 md:p-6 bg-white rounded-[24px] border border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-md transition-all group relative">
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <div className="hidden md:block flex-1 w-[1px] bg-slate-100" />
                <Button
                  onClick={() => deleteItem(item.id)}
                  variant="ghost"
                  size="icon"
                  className="md:hidden ml-auto text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl h-10 w-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Icoon Naam (Lucide)</Label>
                    <Input
                      value={item.icon_name}
                      onChange={(e) => handleIconChange(item.id, e.target.value)}
                      className="bg-white rounded-xl h-11 border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                      placeholder="Bijv. Cpu, Zap, Activity..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Titel</Label>
                    <Input
                      value={item.translations[lang.id]?.title || ''}
                      onChange={(e) => handleItemChange(item.id, lang.id, 'title', e.target.value)}
                      className="bg-white rounded-xl h-11 border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                      placeholder="Dienst titel"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Beschrijving</Label>
                  <Textarea
                    value={item.translations[lang.id]?.description || ''}
                    onChange={(e) => handleItemChange(item.id, lang.id, 'description', e.target.value)}
                    className="bg-white rounded-xl border-primary/20 focus:border-primary text-primary font-bold min-h-[100px] shadow-sm w-full"
                    placeholder="Wat houdt deze dienst in?"
                  />
                </div>
              </div>
              <Button
                onClick={() => deleteItem(item.id)}
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-300 hover:text-red-500 rounded-xl mt-6"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={() => saveForLanguage(lang.id)} disabled={isSaving} className="w-full sm:w-auto rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/10 bg-primary text-white">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {lang.name} Items Opslaan
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// --- FAQ EDITOR ---
export function FAQEditor({ languages }: { languages: Language[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [headerKeys, setHeaderKeys] = useState<any[]>([]);
  const [headerTranslations, setHeaderTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
    if (languages.length > 0) setActiveTab(languages[0].id);
  }, [languages]);

  const initializeFAQSection = async () => {
    setIsInitializing(true);
    try {
      let { data: section } = await supabase.from('sections').select('id').eq('name', 'faq').single();
      if (!section) {
        const { data: newSection } = await supabase.from('sections').insert({ name: 'faq', display_name: 'FAQ' }).select().single();
        section = newSection;
      }

      if (!section) throw new Error("Could not find or create 'faq' section");

      const targetKeys = [
        { key: 'header_title', type: 'text', defaults: { nl: 'Veelgestelde', en: 'Frequently Asked', es: 'Preguntas' } },
        { key: 'header_title_accent', type: 'text', defaults: { nl: 'Vragen', en: 'Questions', es: 'Frecuentes' } },
        { key: 'header_subtitle', type: 'textarea', defaults: { nl: 'Alles wat u moet weten over onze werkwijze en expertise.', en: 'Everything you need to know about our workflow and expertise.', es: 'Todo lo que necesita saber sobre nuestro flujo de trabajo y experiencia.' } },
        { key: 'cta_title', type: 'text', defaults: { nl: 'Nog vragen?', en: 'Any questions?', es: '¿Tiene preguntas?' } },
        { key: 'cta_subtitle', type: 'textarea', defaults: { nl: 'We helpen graag om uw project tot een succes te maken.', en: "We're happy to help make your project a success.", es: 'Estaremos encantados de ayudarle a que su proyecto sea un éxito.' } },
        { key: 'cta_button', type: 'text', defaults: { nl: 'Contacteer ons', en: 'Contact us', es: 'Contáctenos' } }
      ];

      for (const tk of targetKeys) {
        const { data: existingKey } = await supabase.from('content_keys').select('id').eq('section_id', section.id).eq('key', tk.key).single();
        let keyId = existingKey?.id;

        if (!keyId) {
          const { data: newKey } = await supabase.from('content_keys').insert({ section_id: section.id, key: tk.key, field_type: tk.type }).select().single();
          if (newKey) keyId = newKey.id;
        }

        if (keyId) {
          // Check and add missing translations for all languages
          for (const lang of languages) {
            const { data: existingTrans } = await supabase.from('translations').select('id').eq('content_key_id', keyId).eq('language_id', lang.id).single();
            
            if (!existingTrans) {
              const val = (tk.defaults as any)[lang.code.toLowerCase()];
              if (val) {
                await supabase.from('translations').insert({ content_key_id: keyId, language_id: lang.id, value: val });
              }
            }
          }
        }
      }

      toast.success('FAQ header content gesynchroniseerd!');
      await fetchItems();
    } catch (error: any) {
      toast.error('Sync mislukt: ' + error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  async function fetchItems() {
    console.log('FAQEditor: Fetching items...');
    try {
      // 1. Fetch/Ensure FAQ Section exists
      let { data: section, error: secErr } = await supabase.from('sections').select('id').eq('name', 'faq').single();
      
      if (secErr || !section) {
        console.log('FAQEditor: Section "faq" not found, trying "FAQ"...');
        const { data: secUpper } = await supabase.from('sections').select('id').eq('name', 'FAQ').single();
        section = secUpper;
      }

      if (!section) {
        console.log('FAQEditor: No FAQ section found, creating one...');
        const { data: newSection, error: insErr } = await supabase.from('sections').insert({ name: 'faq', display_name: 'FAQ' }).select().single();
        if (insErr) {
          console.error('FAQEditor: Error creating FAQ section:', insErr);
          toast.error('Kan FAQ sectie niet aanmaken in database');
          return;
        }
        section = newSection;
      }

      console.log('FAQEditor: Found section ID:', section.id);

      if (section) {
        // 2. Define the keys we expect with multilingual defaults
        const targetKeys = [
          { key: 'header_title', type: 'text', defaults: { nl: 'Veelgestelde', en: 'Frequently Asked', es: 'Preguntas' } },
          { key: 'header_title_accent', type: 'text', defaults: { nl: 'Vragen', en: 'Questions', es: 'Frecuentes' } },
          { key: 'header_subtitle', type: 'textarea', defaults: { nl: 'Alles wat u moet weten over onze werkwijze en expertise.', en: 'Everything you need to know about our workflow and expertise.', es: 'Todo lo que necesita saber sobre nuestro flujo de trabajo y experiencia.' } },
          { key: 'cta_title', type: 'text', defaults: { nl: 'Nog vragen?', en: 'Any questions?', es: '¿Tiene preguntas?' } },
          { key: 'cta_subtitle', type: 'textarea', defaults: { nl: 'We helpen graag om uw project tot een succes te maken.', en: "We're happy to help make your project a success.", es: 'Estaremos encantados de ayudarle a que su proyecto sea un éxito.' } },
          { key: 'cta_button', type: 'text', defaults: { nl: 'Contacteer ons', en: 'Contact us', es: 'Contáctenos' } }
        ];

        // 3. Fetch all current keys
        const { data: cKeys, error: keysErr } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
        if (keysErr) {
          console.error('FAQEditor: Error fetching content keys:', keysErr);
          throw keysErr;
        }
        
        let currentKeys = cKeys || [];
        console.log(`FAQEditor: Found ${currentKeys.length} keys in DB`);
        const currentKeyNames = new Set(currentKeys.map(k => k.key));
        
        // 4. Automatic Repair: If any expected key is missing, create it
        for (const tk of targetKeys) {
          const legacyKey = `faq.${tk.key}`;
          if (!currentKeyNames.has(tk.key) && !currentKeyNames.has(legacyKey)) {
            console.log(`FAQEditor: Creating missing key: ${tk.key}`);
            const { data: newKey, error: createErr } = await supabase.from('content_keys').insert({ 
              section_id: section.id, 
              key: tk.key, 
              field_type: tk.type 
            }).select().single();
            
            if (!createErr && newKey) {
              currentKeys.push(newKey);
              
              // Add default translations for all available languages
              for (const lang of languages) {
                const defaultValue = (tk.defaults as any)[lang.code.toLowerCase()];
                if (defaultValue) {
                  await supabase.from('translations').insert({ 
                    content_key_id: newKey.id, 
                    language_id: lang.id, 
                    value: defaultValue 
                  });
                }
              }
            } else if (createErr) {
              console.error(`FAQEditor: Error creating key ${tk.key}:`, createErr);
            }
          }
        }
        
        setHeaderKeys(currentKeys);

        // 5. Fetch translations
        if (currentKeys.length > 0) {
          const { data: hTrans, error: transErr } = await supabase.from('translations').select('*').in('content_key_id', currentKeys.map(k => k.id));
          if (transErr) {
            console.error('FAQEditor: Error fetching translations:', transErr);
            throw transErr;
          }
          
          const hTransMap: Record<string, string> = {};
          hTrans?.forEach(t => { hTransMap[`${t.content_key_id}_${t.language_id}`] = t.value || ''; });
          setHeaderTranslations(hTransMap);
        }
      }

      // 6. Fetch FAQ Items
      const { data: fItems } = await supabase.from('faq_items').select('*').order('sort_order', { ascending: true });
      const { data: trans } = await supabase.from('faq_item_translations').select('*');

      const formatted = (fItems || []).map(item => ({
        ...item,
        translations: (trans || []).filter(t => t.faq_item_id === item.id).reduce((acc, t) => {
          acc[t.language_id] = { question: t.question, answer: t.answer };
          return acc;
        }, {} as any)
      }));
      setItems(formatted);
    } catch (error: any) {
      console.error('FAQ Editor fetch error:', error);
      toast.error('Fout bij laden FAQ data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleItemChange = (itemId: string, langId: string, field: string, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          translations: {
            ...item.translations,
            [langId]: { ...(item.translations[langId] || {}), [field]: value }
          }
        };
      }
      return item;
    }));
  };

  const addItem = async () => {
    const { data, error } = await supabase.from('faq_items').insert({
      sort_order: items.length
    }).select().single();

    if (error) return toast.error('Fout bij toevoegen');

    setItems([...items, { ...data, translations: {} }]);
    toast.success('Vraag toegevoegd');
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('faq_items').delete().eq('id', id);
    if (error) return toast.error('Fout bij verwijderen');
    setItems(items.filter(i => i.id !== id));
    toast.success('Vraag verwijderd');
  };

  const saveForLanguage = async (langId: string) => {
    setIsSaving(true);
    try {
      // 1. Save FAQ Items
      const updates = items.map(item => ({
        faq_item_id: item.id,
        language_id: langId,
        question: item.translations[langId]?.question || '',
        answer: item.translations[langId]?.answer || ''
      }));
      await supabase.from('faq_item_translations').upsert(updates, { onConflict: 'faq_item_id,language_id' });

      // 2. Save Section Header
      const activeKeyIds = headerKeys
        .filter(key => [
          'header_title', 'header_title_accent', 'header_subtitle', 
          'cta_title', 'cta_subtitle', 'cta_button',
          'faq.header_title', 'faq.header_title_accent', 'faq.header_subtitle'
        ].includes(key.key))
        .map(k => k.id);

      if (activeKeyIds.length > 0) {
        const hUpdates = activeKeyIds.map(keyId => ({
          content_key_id: keyId,
          language_id: langId,
          value: headerTranslations[`${keyId}_${langId}`] || ''
        }));
        await supabase.from('translations').upsert(hUpdates, { onConflict: 'content_key_id,language_id' });
      }

      toast.success('FAQs en header opgeslagen');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {headerKeys.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={initializeFAQSection}
              disabled={isInitializing}
              className="hidden md:flex border-amber-100 text-amber-600 hover:bg-amber-50 rounded-xl h-10 gap-2"
            >
              {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Sync Header
            </Button>
          )}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:hidden">Selecteer Taal</Label>
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
            <TabsList className="hidden sm:flex bg-slate-100 p-1 rounded-xl w-fit">
              {languages.map(l => (
                <TabsTrigger
                  key={l.id}
                  value={l.id}
                  className="rounded-lg px-6 font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {l.code.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <Button onClick={addItem} variant="outline" size="sm" className="w-full sm:w-auto rounded-xl border-primary/20 text-primary hover:bg-blue-50 transition-all h-11 sm:h-9">
          <Plus className="w-4 h-4 mr-2" /> Vraag Toevoegen
        </Button>
      </div>

      {languages.map(lang => (
        <TabsContent key={lang.id} value={lang.id} className="space-y-8">
          {/* Section Header Editor */}
          <div className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-primary" />
              <h4 className="font-bold text-slate-700">FAQ Sectie Teksten</h4>
            </div>

            <div className="space-y-4">
              {headerKeys.length === 0 && (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm border border-amber-100 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Geen velden gevonden in de database. Klik op <strong>Sync Header</strong>.</span>
                </div>
              )}
              {(() => {
                const key = headerKeys.find(k => k.key === 'header_title' || k.key === 'faq.header_title');
                if (!key) return null;
                return (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Titel</Label>
                    <Input
                      value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                      onChange={(e) => setHeaderTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                      className="bg-white rounded-xl h-11 border-slate-300 focus:border-primary font-bold shadow-sm text-slate-900"
                      placeholder="Bijv. Veelgestelde"
                    />
                  </div>
                );
              })()}

              {(() => {
                const key = headerKeys.find(k => k.key === 'header_title_accent' || k.key === 'faq.header_title_accent');
                if (!key) return null;
                return (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Titel Accent (Blauw)</Label>
                    <Input
                      value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                      onChange={(e) => setHeaderTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                      className="bg-white rounded-xl h-11 border-slate-300 focus:border-primary font-bold shadow-sm text-primary"
                      placeholder="Bijv. Vragen"
                    />
                  </div>
                );
              })()}

              {(() => {
                const key = headerKeys.find(k => k.key === 'header_subtitle' || k.key === 'faq.header_subtitle');
                if (!key) return null;
                return (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Beschrijving</Label>
                    <Textarea
                      value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                      onChange={(e) => setHeaderTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                      className="bg-white rounded-xl border-slate-300 focus:border-primary font-medium shadow-sm min-h-[80px] text-slate-900"
                      placeholder="Korte beschrijving van de FAQ sectie..."
                    />
                  </div>
                );
              })()}

              <div className="border-t border-slate-100 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-slate-700">FAQ CTA Sectie</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const key = headerKeys.find(k => k.key === 'cta_title');
                    if (!key) return null;
                    return (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">CTA Titel</Label>
                        <Input
                          value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                          onChange={(e) => setHeaderTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                          className="bg-white rounded-xl h-11 border-slate-300 focus:border-primary font-bold shadow-sm text-slate-900"
                        />
                      </div>
                    );
                  })()}

                  {(() => {
                    const key = headerKeys.find(k => k.key === 'cta_button');
                    if (!key) return null;
                    return (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">CTA Knop Tekst</Label>
                        <Input
                          value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                          onChange={(e) => setHeaderTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                          className="bg-white rounded-xl h-11 border-slate-300 focus:border-primary font-bold shadow-sm text-slate-900"
                        />
                      </div>
                    );
                  })()}
                </div>

                {(() => {
                  const key = headerKeys.find(k => k.key === 'cta_subtitle');
                  if (!key) return null;
                  return (
                    <div className="space-y-2 mt-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">CTA Beschrijving</Label>
                      <Textarea
                        value={headerTranslations[`${key.id}_${lang.id}`] || ''}
                        onChange={(e) => setHeaderTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                        className="bg-white rounded-xl border-slate-300 focus:border-primary font-medium shadow-sm min-h-[60px] text-slate-900"
                      />
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 ml-1">
              <MessageCircle className="w-4 h-4 text-primary" />
              <h4 className="font-bold text-slate-700">Vragen & Antwoorden</h4>
            </div>
            {items.map((item, idx) => (
              <div key={item.id} className="p-4 md:p-6 bg-white rounded-[24px] border border-slate-100 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Vraag {idx + 1}</span>
                  <Button onClick={() => deleteItem(item.id)} variant="ghost" size="sm" className="text-red-400 h-8 rounded-lg hover:bg-red-50">Verwijderen</Button>
                </div>
                <Input
                  value={item.translations[lang.id]?.question || ''}
                  onChange={(e) => handleItemChange(item.id, lang.id, 'question', e.target.value)}
                  className="bg-white rounded-xl border-primary/20 focus:border-primary text-primary font-bold h-11 shadow-sm w-full"
                  placeholder="De Vraag..."
                />
                <Textarea
                  value={item.translations[lang.id]?.answer || ''}
                  onChange={(e) => handleItemChange(item.id, lang.id, 'answer', e.target.value)}
                  className="bg-white rounded-xl border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                  placeholder="Het Antwoord..."
                  rows={3}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => saveForLanguage(lang.id)} disabled={isSaving} className="w-full sm:w-auto rounded-xl px-8 h-12 font-bold bg-primary text-white">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {lang.name} FAQs Opslaan
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// --- TEXT SECTION EDITOR ---
export function TextSectionEditor({ languages, sectionName }: { languages: Language[], sectionName: string }) {
  const [keys, setKeys] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchData();
    if (languages.length > 0) setActiveTab(languages[0].id);
  }, [languages, sectionName]);

  async function fetchData() {
    try {
      const { data: section } = await supabase.from('sections').select('id').eq('name', sectionName).single();
      if (!section) return;

      const { data: cKeys } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
      setKeys(cKeys || []);

      const { data: trans } = await supabase.from('translations').select('*').in('content_key_id', (cKeys || []).map(k => k.id));
      const transMap: Record<string, string> = {};
      trans?.forEach(t => {
        transMap[`${t.content_key_id}_${t.language_id}`] = t.value || '';
      });
      setTranslations(transMap);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (langId: string) => {
    setIsSaving(true);
    try {
      const updates = keys.map(key => ({
        content_key_id: key.id,
        language_id: langId,
        value: translations[`${key.id}_${langId}`] || ''
      }));
      await supabase.from('translations').upsert(updates, { onConflict: 'content_key_id,language_id' });
      toast.success(`${sectionName} opgeslagen`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col gap-2 mb-6 w-full">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:hidden">Selecteer Taal</Label>
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
        <TabsList className="hidden sm:flex bg-slate-100 p-1 rounded-xl w-fit">
          {languages.map(l => (
            <TabsTrigger
              key={l.id}
              value={l.id}
              className="rounded-lg px-6 font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {l.code.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {languages.map(lang => (
        <TabsContent key={lang.id} value={lang.id} className="space-y-6">
          {keys.map(key => (
            <div key={key.id} className="space-y-3 w-full">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">{key.key.replace('_', ' ')}</Label>
              {key.field_type === 'textarea' ? (
                <Textarea
                  value={translations[`${key.id}_${lang.id}`] || ''}
                  onChange={(e) => setTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                  className="bg-white border-primary/20 rounded-2xl min-h-[120px] focus:border-primary text-primary font-bold shadow-sm transition-all w-full"
                />
              ) : (
                <Input
                  value={translations[`${key.id}_${lang.id}`] || ''}
                  onChange={(e) => setTranslations(prev => ({ ...prev, [`${key.id}_${lang.id}`]: e.target.value }))}
                  className="bg-white border-primary/20 rounded-2xl h-12 focus:border-primary text-primary font-bold shadow-sm transition-all w-full"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={() => handleSave(lang.id)} disabled={isSaving} className="w-full sm:w-auto rounded-xl px-8 h-12 font-bold bg-primary text-white">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {lang.name} Opslaan
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// --- PROCESS EDITOR ---
export function ProcessEditor({ languages }: { languages: Language[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
    if (languages.length > 0) setActiveTab(languages[0].id);
  }, [languages]);

  async function fetchItems() {
    try {
      const { data: pItems } = await supabase.from('process_steps').select('*').order('sort_order', { ascending: true });
      const { data: trans } = await supabase.from('process_step_translations').select('*');

      const formatted = (pItems || []).map(item => ({
        ...item,
        translations: (trans || []).filter(t => t.process_step_id === item.id).reduce((acc, t) => {
          acc[t.language_id] = { title: t.title, description: t.description };
          return acc;
        }, {} as any)
      }));
      setItems(formatted);
    } finally {
      setIsLoading(false);
    }
  }

  const handleItemChange = (itemId: string, langId: string, field: string, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          translations: {
            ...item.translations,
            [langId]: { ...(item.translations[langId] || {}), [field]: value }
          }
        };
      }
      return item;
    }));
  };

  const addItem = async () => {
    const { data, error } = await supabase.from('process_steps').insert({
      sort_order: items.length
    }).select().single();

    if (error) return toast.error('Fout bij toevoegen');

    setItems([...items, { ...data, translations: {} }]);
    toast.success('Stap toegevoegd');
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('process_steps').delete().eq('id', id);
    if (error) return toast.error('Fout bij verwijderen');
    setItems(items.filter(i => i.id !== id));
    toast.success('Stap verwijderd');
  };

  const saveForLanguage = async (langId: string) => {
    setIsSaving(true);
    try {
      const updates = items.map(item => ({
        process_step_id: item.id,
        language_id: langId,
        title: item.translations[langId]?.title || '',
        description: item.translations[langId]?.description || ''
      }));
      await supabase.from('process_step_translations').upsert(updates, { onConflict: 'process_step_id,language_id' });
      toast.success('Processtappen opgeslagen');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:hidden">Selecteer Taal</Label>
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
          <TabsList className="hidden sm:flex bg-slate-100 p-1 rounded-xl w-fit">
            {languages.map(l => (
              <TabsTrigger
                key={l.id}
                value={l.id}
                className="rounded-lg px-6 font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {l.code.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Button onClick={addItem} variant="outline" size="sm" className="w-full sm:w-auto rounded-xl border-primary/20 text-primary hover:bg-blue-50 transition-all h-11 sm:h-9">
          <Plus className="w-4 h-4 mr-2" /> Stap Toevoegen
        </Button>
      </div>

      {languages.map(lang => (
        <TabsContent key={lang.id} value={lang.id} className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 md:p-6 bg-white rounded-[24px] border border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-md transition-all group relative">
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <div className="hidden md:block flex-1 w-[1px] bg-slate-100" />
                <Button
                  onClick={() => deleteItem(item.id)}
                  variant="ghost"
                  size="icon"
                  className="md:hidden ml-auto text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl h-10 w-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Stap Titel</Label>
                  <Input
                    value={item.translations[lang.id]?.title || ''}
                    onChange={(e) => handleItemChange(item.id, lang.id, 'title', e.target.value)}
                    className="bg-white rounded-xl h-11 border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                    placeholder="Stap Titel"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Stap Beschrijving</Label>
                  <Textarea
                    value={item.translations[lang.id]?.description || ''}
                    onChange={(e) => handleItemChange(item.id, lang.id, 'description', e.target.value)}
                    className="bg-white rounded-xl border-primary/20 focus:border-primary text-primary font-bold shadow-sm w-full"
                    placeholder="Stap Beschrijving"
                  />
                </div>
              </div>
              <Button
                onClick={() => deleteItem(item.id)}
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-300 hover:text-red-500 rounded-xl mt-6"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={() => saveForLanguage(lang.id)} disabled={isSaving} className="w-full sm:w-auto rounded-xl px-8 h-12 font-bold bg-primary text-white">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {lang.name} Stappen Opslaan
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// --- TRUST / PARTNERS EDITOR ---
export function TrustEditor() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const { data } = await supabase.from('partners').select('*').order('sort_order', { ascending: true });
      setItems(data || []);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateName = (id: string, name: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, name } : item));
  };

  const addItem = async () => {
    const { data, error } = await supabase.from('partners').insert({
      name: 'Nieuwe Partner',
      logo_url: '',
      sort_order: items.length
    }).select().single();

    if (error) return toast.error('Fout bij toevoegen');

    setItems([...items, data]);
    toast.success('Partner toegevoegd');
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) return toast.error('Fout bij verwijderen');
    setItems(items.filter(i => i.id !== id));
    toast.success('Partner verwijderd');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = items.map(item => ({
        id: item.id,
        name: item.name,
        logo_url: item.logo_url,
        sort_order: item.sort_order
      }));
      await supabase.from('partners').upsert(updates);
      toast.success('Partners bijgewerkt');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="p-5 bg-white rounded-[24px] border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-primary transition-colors">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Partner Naam</Label>
              <Input
                value={item.name}
                onChange={(e) => handleUpdateName(item.id, e.target.value)}
                className="bg-white border-primary/20 rounded-xl h-10 text-sm font-bold text-primary focus:border-primary shadow-sm"
              />
            </div>
            <Button onClick={() => deleteItem(item.id)} variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl h-10 w-10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addItem} variant="outline" className="h-full min-h-[100px] border-dashed border-2 rounded-[24px] border-slate-200 hover:border-primary hover:bg-blue-50/50 hover:text-primary transition-all flex flex-col gap-2">
          <Plus className="w-6 h-6" />
          <span className="text-sm font-bold">Nieuwe Partner Toevoegen</span>
        </Button>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto rounded-xl px-12 h-12 font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Partner Wijzigingen Opslaan
        </Button>
      </div>
    </div>
  );
}
