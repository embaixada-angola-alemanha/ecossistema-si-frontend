import { Injectable } from '@angular/core';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

@Injectable({ providedIn: 'root' })
export class SitemapService {

  private readonly baseUrl = 'https://www.angola-botschaft.de';

  getStaticEntries(): SitemapEntry[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      { loc: '/', changefreq: 'daily', priority: 1.0, lastmod: today },
      { loc: '/embaixador', changefreq: 'monthly', priority: 0.8, lastmod: today },
      { loc: '/sobre-angola', changefreq: 'monthly', priority: 0.8, lastmod: today },
      { loc: '/sobre-angola/presidente', changefreq: 'monthly', priority: 0.7, lastmod: today },
      { loc: '/sobre-angola/poderes', changefreq: 'monthly', priority: 0.7, lastmod: today },
      { loc: '/sobre-angola/geografia', changefreq: 'yearly', priority: 0.6, lastmod: today },
      { loc: '/sobre-angola/historia', changefreq: 'yearly', priority: 0.6, lastmod: today },
      { loc: '/sobre-angola/demografia', changefreq: 'yearly', priority: 0.6, lastmod: today },
      { loc: '/sobre-angola/economia', changefreq: 'monthly', priority: 0.7, lastmod: today },
      { loc: '/sobre-angola/cultura', changefreq: 'yearly', priority: 0.6, lastmod: today },
      { loc: '/sobre-angola/simbolos', changefreq: 'yearly', priority: 0.5, lastmod: today },
      { loc: '/relacoes-bilaterais', changefreq: 'monthly', priority: 0.8, lastmod: today },
      { loc: '/sector-consular', changefreq: 'weekly', priority: 0.9, lastmod: today },
      { loc: '/eventos', changefreq: 'weekly', priority: 0.8, lastmod: today },
      { loc: '/contactos', changefreq: 'monthly', priority: 0.9, lastmod: today }
    ];
  }

  generateXml(entries: SitemapEntry[]): string {
    const urls = entries.map(entry => `
  <url>
    <loc>${this.baseUrl}${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    ${this.generateHreflangLinks(entry.loc)}
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>`;
  }

  private generateHreflangLinks(path: string): string {
    const langs = [
      { code: 'pt', hreflang: 'pt' },
      { code: 'en', hreflang: 'en' },
      { code: 'de', hreflang: 'de' },
      { code: 'cs', hreflang: 'pt-CV' }
    ];

    return langs.map(lang =>
      `<xhtml:link rel="alternate" hreflang="${lang.hreflang}" href="${this.baseUrl}${path}?lang=${lang.code}" />`
    ).join('\n    ');
  }
}
