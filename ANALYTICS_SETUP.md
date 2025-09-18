# Analytics Setup Guide for Swap My Look

## Google Analytics 4 (GA4)

### 1. Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Install Google Analytics
Add this script to your `index.html` head section:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR_MEASUREMENT_ID');
</script>
```

### 3. Track Custom Events
Add event tracking in your React components:

```javascript
// Track outfit selection
const trackOutfitSelection = (outfit) => {
  if (window.gtag) {
    gtag('event', 'outfit_select', {
      'outfit_category': outfit.category,
      'outfit_name': outfit.name,
      'value': 1
    });
  }
};

// Track model selection
const trackModelSelection = (model) => {
  if (window.gtag) {
    gtag('event', 'model_select', {
      'model_gender': model.category,
      'model_name': model.name,
      'value': 1
    });
  }
};
```

## Google Search Console

### 1. Verify Ownership
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add your domain (`swapmylook.com`)
3. Verify ownership via DNS record or HTML file upload

### 2. Submit Sitemap
1. In Search Console, go to "Sitemaps"
2. Submit your sitemap URL: `https://swapmylook.com/sitemap.xml`

## Performance Monitoring

### 1. Core Web Vitals
Google Analytics automatically tracks Core Web Vitals. Monitor:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)  
- Cumulative Layout Shift (CLS)

### 2. Lighthouse Audits
Run regular Lighthouse audits:
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://swapmylook.com --view
```

## Alternative Analytics Options

### 1. Plausible Analytics (Privacy-focused)
```html
<script defer data-domain="swapmylook.com" src="https://plausible.io/js/script.js"></script>
```

### 2. Microsoft Clarity (Heatmaps)
```html
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

## SEO Monitoring Tools

### 1. SEMrush
- Track keyword rankings for your target keywords
- Monitor backlinks and domain authority
- Competitor analysis

### 2. Ahrefs
- Track organic search traffic
- Monitor keyword positions
- Analyze competitor strategies

## Important Metrics to Track

### User Engagement
- Session duration
- Pages per session
- Bounce rate
- Conversion rate (outfit selections)

### Technical SEO
- Page load speed
- Mobile responsiveness
- Indexation status
- Crawl errors

### Content Performance
- Top performing pages
- Keyword rankings
- Organic traffic sources

## Regular Maintenance

1. **Weekly**: Check Google Search Console for errors
2. **Monthly**: Run full SEO audit
3. **Quarterly**: Update sitemap and review keyword strategy
4. **Annually**: Complete technical SEO audit

## UTM Parameters for Campaign Tracking

Use these UTM parameters for marketing campaigns:
- `utm_source` (e.g., facebook, google, email)
- `utm_medium` (e.g., cpc, social, email)
- `utm_campaign` (e.g., summer_sale, new_feature)
- `utm_content` (e.g., banner_ad, text_link)

Example: `https://swapmylook.com/?utm_source=facebook&utm_medium=social&utm_campaign=summer_collection`