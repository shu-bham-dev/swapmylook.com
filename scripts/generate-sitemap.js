const fs = require('fs');
const path = require('path');

// List of all public pages in your application that should be indexed by search engines
const pages = [
  {
    url: 'https://swapmylook.com/',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'https://swapmylook.com/about',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'https://swapmylook.com/contact',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'https://swapmylook.com/subscription',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'https://swapmylook.com/terms',
    changefreq: 'yearly',
    priority: '0.5',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'https://swapmylook.com/blog',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'https://swapmylook.com/ai-clothes-changer',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap to public directory
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully!');
console.log('Pages included:', pages.length);