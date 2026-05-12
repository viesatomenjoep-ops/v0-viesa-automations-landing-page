import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFooter() {
  const { data: sections } = await supabase.from('sections').select('*').eq('name', 'footer');
  console.log('Sections named footer:', sections);

  if (sections && sections.length > 0) {
    for (const section of sections) {
      const { data: keys } = await supabase.from('content_keys').select('*').eq('section_id', section.id);
      console.log(`Keys for section ${section.id}:`, keys);

      if (keys) {
        for (const key of keys) {
           const { data: trans } = await supabase.from('translations').select('*, languages(code)').eq('content_key_id', key.id);
           console.log(`Translations for key ${key.key}:`, trans);
        }
      }
    }
  }
}

checkFooter();
