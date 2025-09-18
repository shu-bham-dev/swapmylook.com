import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export function SEO({
  title = "AI Fashion Outfit Selector - Try Virtual Outfits Instantly | Swap My Look",
  description = "AI-powered fashion outfit selector. Try on virtual outfits, change colors, and create stunning looks with our AI outfit changer technology.",
  keywords = "ai outfit changer, ai to change color of background based on outfit, outfit changer ai, change outfit ai, outfit change ai, ai change outfit, best ai outfit changer, ai change outfit free, change outfit with ai, ai change my outfit",
  image = "/images/og-image.jpg",
  url = "https://swapmylook.com/",
  type = "website",
  schema
}: SEOProps) {
  const fullTitle = title.includes("Swap My Look") ? title : `${title} | Swap My Look`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Swap My Look" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data / JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// Predefined SEO configurations for different pages
export const homePageSEO = {
  title: "AI Fashion Outfit Selector - Try Virtual Outfits Instantly",
  description: "Experience the future of fashion with our AI outfit changer. Try on virtual outfits, change colors, and create stunning looks instantly.",
  url: "https://swapmylook.com/",
  schema: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Swap My Look - AI Fashion Outfit Selector",
    "description": "AI-powered fashion outfit selector and virtual try-on platform",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
};

export const aboutPageSEO = {
  title: "About Swap My Look - AI Fashion Technology",
  description: "Learn about our AI-powered fashion technology and how we're revolutionizing virtual try-ons and outfit selection.",
  url: "https://swapmylook.com/about",
  schema: {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Swap My Look",
    "description": "AI-powered fashion outfit selector and virtual try-on platform"
  }
};

export const contactPageSEO = {
  title: "Contact Us - Swap My Look Support",
  description: "Get in touch with the Swap My Look team for support, partnerships, or any questions about our AI fashion technology.",
  url: "https://swapmylook.com/contact",
  schema: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Swap My Look"
  }
};

export const helpPageSEO = {
  title: "Help & FAQ - Swap My Look Support",
  description: "Find answers to frequently asked questions and get help with using our AI fashion outfit selector platform.",
  url: "https://swapmylook.com/help",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Swap My Look Help & FAQ"
  }
};