'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Globe } from 'lucide-react';
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
      const updates = items.map(item => ({
        faq_item_id: item.id,
        language_id: langId,
        question: item.translations[langId]?.question || '',
        answer: item.translations[langId]?.answer || ''
      }));
      await supabase.from('faq_item_translations').upsert(updates, { onConflict: 'faq_item_id,language_id' });
      toast.success('FAQs opgeslagen');
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
          <Plus className="w-4 h-4 mr-2" /> Vraag Toevoegen
        </Button>
      </div>

      {languages.map(lang => (
        <TabsContent key={lang.id} value={lang.id} className="space-y-4">
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
