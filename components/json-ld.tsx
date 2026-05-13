export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VIESA Automations",
    "url": "https://viesa-automations.nl",
    "logo": "https://viesa-automations.nl/viesa-logo.png",
    "description": "Transforming businesses through intelligent automation and high-end digital solutions.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Breda",
      "addressCountry": "NL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+31-6-12345678",
      "contactType": "customer service"
    }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
