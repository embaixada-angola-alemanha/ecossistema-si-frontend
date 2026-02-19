import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';
import { filter } from 'rxjs';
import { environment } from '@env/environment';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {

  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly langService = inject(LanguageService);

  private readonly siteUrl = 'https://www.angola-botschaft.de';
  private readonly siteName = environment.siteName;

  init(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateHreflangTags());
  }

  updateMeta(data: SeoData): void {
    const title = data.title
      ? `${data.title} | ${this.siteName}`
      : this.siteName;

    this.titleService.setTitle(title);

    this.setMetaTag('description', data.description ?? '');
    this.setMetaTag('keywords', data.keywords ?? '');

    // Open Graph
    this.setMetaTag('og:title', title, 'property');
    this.setMetaTag('og:description', data.description ?? '', 'property');
    this.setMetaTag('og:type', data.ogType ?? 'website', 'property');
    this.setMetaTag('og:site_name', this.siteName, 'property');
    this.setMetaTag('og:locale', this.getOgLocale(), 'property');

    if (data.ogImage) {
      this.setMetaTag('og:image', data.ogImage, 'property');
    }

    if (data.canonicalUrl) {
      this.setMetaTag('og:url', data.canonicalUrl, 'property');
      this.updateCanonical(data.canonicalUrl);
    }

    // Twitter Card
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:title', title);
    this.setMetaTag('twitter:description', data.description ?? '');
    if (data.ogImage) {
      this.setMetaTag('twitter:image', data.ogImage);
    }

    // Robots
    if (data.noIndex) {
      this.setMetaTag('robots', 'noindex, nofollow');
    } else {
      this.setMetaTag('robots', 'index, follow');
    }
  }

  updateFromTranslation(titleKey: string, descriptionKey?: string): void {
    const title = this.translate.instant(titleKey);
    const description = descriptionKey ? this.translate.instant(descriptionKey) : '';
    this.updateMeta({ title, description });
  }

  setStructuredData(schema: Record<string, unknown>): void {
    this.removeStructuredData();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  removeStructuredData(): void {
    const existing = this.document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }
  }

  getOrganizationSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'GovernmentOrganization',
      'name': 'Embaixada da Republica de Angola na Republica Federal da Alemanha',
      'alternateName': [
        'Embassy of the Republic of Angola in Germany',
        'Botschaft der Republik Angola in Deutschland'
      ],
      'url': this.siteUrl,
      'logo': `${this.siteUrl}/assets/images/brasao-angola.svg`,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'DE',
        'addressLocality': 'Berlin'
      },
      'parentOrganization': {
        '@type': 'GovernmentOrganization',
        'name': 'Republica de Angola',
        'url': 'https://www.governo.gov.ao'
      },
      'sameAs': []
    };
  }

  getEventSchema(event: {
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: string;
    url: string;
  }): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': event.title,
      'description': event.description,
      'startDate': event.startDate,
      'endDate': event.endDate ?? event.startDate,
      'location': {
        '@type': 'Place',
        'name': event.location
      },
      'organizer': {
        '@type': 'GovernmentOrganization',
        'name': 'Embaixada de Angola na Alemanha',
        'url': this.siteUrl
      },
      'url': event.url
    };
  }

  getBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${this.siteUrl}${item.url}`
      }))
    };
  }

  private updateHreflangTags(): void {
    // Remove existing hreflang links
    const existing = this.document.querySelectorAll('link[hreflang]');
    existing.forEach(el => el.remove());

    const path = this.router.url.split('?')[0];
    const languages = [
      { code: 'pt', hreflang: 'pt' },
      { code: 'en', hreflang: 'en' },
      { code: 'de', hreflang: 'de' },
      { code: 'cs', hreflang: 'pt-CV' }
    ];

    languages.forEach(lang => {
      const link = this.document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang.hreflang;
      link.href = `${this.siteUrl}${path}?lang=${lang.code}`;
      this.document.head.appendChild(link);
    });

    // x-default
    const defaultLink = this.document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${this.siteUrl}${path}`;
    this.document.head.appendChild(defaultLink);
  }

  private updateCanonical(url: string): void {
    let canonical = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  private setMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    if (attribute === 'property') {
      this.meta.updateTag({ property: name, content });
    } else {
      this.meta.updateTag({ name, content });
    }
  }

  private getOgLocale(): string {
    const lang = this.langService.currentLang();
    const map: Record<string, string> = {
      pt: 'pt_PT', en: 'en_GB', de: 'de_DE', cs: 'pt_CV'
    };
    return map[lang] ?? 'pt_PT';
  }
}
