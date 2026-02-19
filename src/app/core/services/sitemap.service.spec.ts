import { TestBed } from '@angular/core/testing';
import { SitemapService, SitemapEntry } from './sitemap.service';

describe('SitemapService', () => {
  let service: SitemapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitemapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return static entries with correct structure', () => {
    const entries = service.getStaticEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].loc).toBe('/');
    expect(entries[0].priority).toBe(1.0);
    expect(entries[0].changefreq).toBe('daily');
  });

  it('should include all expected routes in static entries', () => {
    const entries = service.getStaticEntries();
    const locs = entries.map(e => e.loc);
    expect(locs).toContain('/');
    expect(locs).toContain('/embaixador');
    expect(locs).toContain('/eventos');
    expect(locs).toContain('/contactos');
  });

  it('should generate valid XML from entries', () => {
    const entries: SitemapEntry[] = [
      { loc: '/test', changefreq: 'daily', priority: 0.8, lastmod: '2026-01-01' },
    ];
    const xml = service.generateXml(entries);
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('<loc>https://www.angola-botschaft.de/test</loc>');
    expect(xml).toContain('<changefreq>daily</changefreq>');
    expect(xml).toContain('<priority>0.8</priority>');
  });
});
