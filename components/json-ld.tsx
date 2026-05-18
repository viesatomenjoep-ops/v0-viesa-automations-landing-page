export function JsonLd() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "VIESA Automations",
    "url": "https://viesa-automations.nl",
    "logo": "https://viesa-automations.nl/viesa-logo.png",
    "image": "https://viesa-automations.nl/viesa-logo.png",
    "description": "Van high-end websites tot complexe CRM-systemen: wij automatiseren uw groei van A tot Z in Breda en omstreken.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Breda",
      "addressCountry": "NL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+31-6-12345678",
      "contactType": "customer service",
      "availableLanguage": ["Dutch", "English"]
    },
    "areaServed": "Netherlands",
    "priceRange": "$$$"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VIESA Automations",
    "url": "https://viesa-automations.nl",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://viesa-automations.nl/portfolio?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
