-- ============================================================
-- SEED: languages
-- ============================================================
insert into public.languages (code, name) values
  ('nl', 'Nederlands'),
  ('en', 'English'),
  ('es', 'Español')
on conflict (code) do nothing;

-- ============================================================
-- One-time helper to seed a section + content_key + nl/en/es
-- translations in a single call. Idempotent (safe to re-run).
-- Dropped again at the end of this file.
-- ============================================================
create or replace function public.seed_content_key(
  p_section text,
  p_display text,
  p_key text,
  p_field_type text,
  p_nl text,
  p_en text,
  p_es text
) returns void
language plpgsql
as $$
declare
  v_section_id uuid;
  v_key_id uuid;
  v_nl_id uuid := (select id from public.languages where code = 'nl');
  v_en_id uuid := (select id from public.languages where code = 'en');
  v_es_id uuid := (select id from public.languages where code = 'es');
begin
  insert into public.sections (name, display_name)
  values (p_section, p_display)
  on conflict (name) do update set display_name = excluded.display_name
  returning id into v_section_id;

  insert into public.content_keys (section_id, key, field_type)
  values (v_section_id, p_key, p_field_type)
  on conflict (section_id, key) do update set field_type = excluded.field_type
  returning id into v_key_id;

  if p_nl is not null then
    insert into public.translations (content_key_id, language_id, value)
    values (v_key_id, v_nl_id, p_nl)
    on conflict (content_key_id, language_id) do update set value = excluded.value;
  end if;

  if p_en is not null then
    insert into public.translations (content_key_id, language_id, value)
    values (v_key_id, v_en_id, p_en)
    on conflict (content_key_id, language_id) do update set value = excluded.value;
  end if;

  if p_es is not null then
    insert into public.translations (content_key_id, language_id, value)
    values (v_key_id, v_es_id, p_es)
    on conflict (content_key_id, language_id) do update set value = excluded.value;
  end if;
end;
$$;

-- Hero (only a Dutch fallback exists in the code; en/es were never hardcoded)
select public.seed_content_key('hero', 'Hero', 'title', 'text', 'Uw Bedrijf op', null, null);
select public.seed_content_key('hero', 'Hero', 'title_accent', 'text', 'Autopiloot', null, null);
select public.seed_content_key('hero', 'Hero', 'subtitle', 'textarea', 'Van high-end platforms tot intelligente CRM-systemen: wij transformeren complexe processen in naadloze digitale ervaringen.', null, null);
select public.seed_content_key('hero', 'Hero', 'cta_primary', 'text', 'Start Project', null, null);
select public.seed_content_key('hero', 'Hero', 'cta_secondary', 'text', 'Onze Visie', null, null);

-- About
select public.seed_content_key('about', 'Over Ons', 'title', 'text', 'Over', null, null);
select public.seed_content_key('about', 'Over Ons', 'title_accent', 'text', 'ons', null, null);
select public.seed_content_key('about', 'Over Ons', 'description_p1', 'textarea', 'Viesa Automations ontwikkelt innovatieve automatiseringsoplossingen en digitale platformen voor bedrijven die sneller, slimmer en efficiënter willen werken.', null, null);
select public.seed_content_key('about', 'Over Ons', 'description_p2', 'textarea', 'Met jarenlange ervaring in programmeren en softwareontwikkeling beschikt het team over diepgaande technische expertise.', null, null);
select public.seed_content_key('about', 'Over Ons', 'description_p3', 'textarea', 'Viesa is actief binnen sectoren zoals retail & media, automotive, vastgoed, transport & logistiek, de equine sector en muziek & entertainment.', null, null);

-- Trust marquee header (no dedicated admin editor for this key; rendered as-is)
select public.seed_content_key('trust', 'Partners & Vertrouwen', 'header', 'text', 'Partnering with Innovation Leaders', null, null);

-- Services
-- NL text matches the fallback hardcoded in components/services-grid.tsx (not the
-- admin editor's own init-default text, which differs) — this avoids a hydration
-- mismatch, since the server always renders that component's fallback text before
-- the client's translation fetch resolves.
select public.seed_content_key('services', 'Diensten', 'header_title', 'text', 'Onze Expertise', 'Our Services', 'Nuestros Servicios');
select public.seed_content_key('services', 'Diensten', 'header_subtitle', 'textarea', 'Wij bouwen de digitale ruggengraat van uw onderneming met moderne technologie en slimme automatisering.', 'Discover what we can do for you.', 'Descubra lo que podemos hacer por usted.');

-- Process
select public.seed_content_key('process', 'Proces', 'header_title', 'text', 'Onze', 'Our', 'Nuestro');
select public.seed_content_key('process', 'Proces', 'header_title_accent', 'text', 'Werkwijze', 'Workflow', 'Proceso');
select public.seed_content_key('process', 'Proces', 'header_subtitle', 'textarea', 'Van concept tot realisatie: een gestroomlijnd proces gericht op snelheid en kwaliteit.', 'From concept to realization: a streamlined process focused on speed and quality.', 'Desde el concepto hasta la realización: un proceso optimizado enfocado en la velocidad y la calidad.');

-- USP ("Waarom Viesa")
select public.seed_content_key('usp', 'Waarom Viesa', 'header_title', 'text', 'Waarom', 'Why', 'Por qué');
select public.seed_content_key('usp', 'Waarom Viesa', 'header_title_accent', 'text', 'VIESA Automations?', 'VIESA Automations?', 'VIESA Automations?');
select public.seed_content_key('usp', 'Waarom Viesa', 'header_subtitle', 'textarea', 'Wij onderscheiden ons door een unieke combinatie van technische expertise, snelheid en integriteit.', 'We distinguish ourselves through a unique combination of technical expertise, speed, and integrity.', 'Nos distinguimos por una combinación única de experiencia técnica, velocidad e integridad.');

-- FAQ
select public.seed_content_key('faq', 'FAQ', 'header_title', 'text', 'Veelgestelde', 'Frequently Asked', 'Preguntas');
select public.seed_content_key('faq', 'FAQ', 'header_title_accent', 'text', 'Vragen', 'Questions', 'Frecuentes');
select public.seed_content_key('faq', 'FAQ', 'header_subtitle', 'textarea', 'Alles wat u moet weten over onze werkwijze en expertise.', 'Everything you need to know about our workflow and expertise.', 'Todo lo que necesita saber sobre nuestro flujo de trabajo y experiencia.');
select public.seed_content_key('faq', 'FAQ', 'cta_title', 'text', 'Nog vragen?', 'Any questions?', '¿Tiene preguntas?');
select public.seed_content_key('faq', 'FAQ', 'cta_subtitle', 'textarea', 'We helpen graag om uw project tot een succes te maken.', 'We''re happy to help make your project a success.', 'Estaremos encantados de ayudarle a que su proyecto sea un éxito.');
select public.seed_content_key('faq', 'FAQ', 'cta_button', 'text', 'Contacteer ons', 'Contact us', 'Contáctenos');

-- Contact modal
select public.seed_content_key('contact', 'Contact Modal', 'title', 'text', 'Laten we bouwen.', 'Let''s build.', 'Vamos a construir.');
select public.seed_content_key('contact', 'Contact Modal', 'subtitle', 'textarea', 'Deel uw visie en wij transformeren het in een digitale realiteit.', 'Share your vision and we will transform it into a digital reality.', 'Comparta su visión y la transformaremos en una realidad digital.');
select public.seed_content_key('contact', 'Contact Modal', 'feature_1', 'text', 'Snelle opvolging binnen 24u', 'Fast follow-up within 24h', 'Seguimiento rápido en 24h');
select public.seed_content_key('contact', 'Contact Modal', 'feature_2', 'text', 'Gratis consultgesprek', 'Free consultation', 'Consulta gratuita');
select public.seed_content_key('contact', 'Contact Modal', 'button_submit', 'text', 'Verstuur Aanvraag', 'Submit Request', 'Enviar Solicitud');
select public.seed_content_key('contact', 'Contact Modal', 'label_first_name', 'text', 'Voornaam', 'First Name', 'Nombre');
select public.seed_content_key('contact', 'Contact Modal', 'label_last_name', 'text', 'Achternaam', 'Last Name', 'Apellido');
select public.seed_content_key('contact', 'Contact Modal', 'label_email', 'text', 'E-mailadres', 'Email Address', 'Correo electrónico');
select public.seed_content_key('contact', 'Contact Modal', 'label_project_type', 'text', 'Project Type', 'Project Type', 'Tipo de proyecto');
select public.seed_content_key('contact', 'Contact Modal', 'label_description', 'text', 'Beschrijving', 'Description', 'Descripción');
select public.seed_content_key('contact', 'Contact Modal', 'success_title', 'text', 'Aanvraag Ontvangen!', 'Request Received!', '¡Solicitud recibida!');
select public.seed_content_key('contact', 'Contact Modal', 'success_message', 'text', 'We nemen binnen 24 uur contact met u op.', 'We will contact you within 24 hours.', 'Nos pondremos en contacto con usted en un plazo de 24 horas.');

-- Portfolio (behind PORTFOLIO_ENABLED feature flag)
select public.seed_content_key('portfolio', 'Portfolio', 'header_title', 'text', 'Onze Projecten', 'Our Projects', 'Nuestros Proyectos');
select public.seed_content_key('portfolio', 'Portfolio', 'header_subtitle', 'textarea', 'Een kijkje in de innovatieve oplossingen die we voor onze klanten hebben gebouwd.', 'A look at the innovative solutions we have built for our clients.', 'Un vistazo a las soluciones innovadoras que hemos construido para nuestros clientes.');
select public.seed_content_key('portfolio', 'Portfolio', 'cta_title', 'text', 'Klaar voor de volgende stap?', 'Ready for the next step?', '¿Listo para el siguiente paso?');
select public.seed_content_key('portfolio', 'Portfolio', 'cta_subtitle', 'textarea', 'Laten we samen kijken hoe we jouw processen kunnen automatiseren en optimaliseren.', 'Let''s look together at how we can automate and optimize your processes.', 'Veamos juntos cómo podemos automatizar y optimizar sus procesos.');
select public.seed_content_key('portfolio', 'Portfolio', 'cta_button_text', 'text', 'Contact Opnemen', 'Get in Touch', 'Contactar');

-- Footer
select public.seed_content_key('footer', 'Footer', 'description', 'textarea', 'Transforming businesses through intelligent automation and high-end digital solutions. Your partner in the next era of tech.', null, null);
select public.seed_content_key('footer', 'Footer', 'header_services', 'text', 'Diensten', 'Services', 'Servicios');
select public.seed_content_key('footer', 'Footer', 'header_company', 'text', 'Bedrijf', 'Company', 'Empresa');
select public.seed_content_key('footer', 'Footer', 'header_contact', 'text', 'Contact', 'Contact', 'Contacto');

drop function public.seed_content_key(text, text, text, text, text, text, text);

-- ============================================================
-- NOT seeded here (item-level rows, unrecoverable from source code):
--   navigation_items / navigation_item_translations (menu links)
--   service_items / service_item_translations
--   process_steps / process_step_translations
--   usp_items / usp_item_translations
--   faq_items / faq_item_translations
--   portfolio_items / portfolio_item_translations
--   partners
-- Re-enter these via /admin/editor after applying these migrations.
-- ============================================================
