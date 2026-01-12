import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export function SEO({
  title = "AI Clothes Changer & Virtual Outfit Try-On",
  description = "SwapMyLook is an AI clothes changer that lets you upload your photo and outfit image to instantly swap clothes and try outfits online with realistic virtual try-on results.",
  keywords = "ai clothes changer, ai outfit changer, ai clothes swap, clothes swap ai, swap clothes ai, ai outfit swap, outfit changer, change clothes ai, ai change clothes, virtual try on, virtual outfit try on, try clothes on, change outfit ai, ai dress changer, clothing photo editing, ai clothing editor, clothes swap ai free",
  image = "https://swapmylook.com/images/og-image.jpg",
  url = "https://swapmylook.com/",
  type = "website",
  schema,
}: SEOProps) {
  const fullTitle = title.includes("SwapMyLook")
    ? title
    : `${title} | SwapMyLook`;
  
  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="SwapMyLook" />
      
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