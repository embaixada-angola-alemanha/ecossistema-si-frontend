import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstitutionalService } from '@core/services/institutional.service';
import { SitePage } from '@core/models/page.model';
import { LocalizedContentPipe } from '@shared/pipes/localized-content.pipe';
import { SeoService } from '@core/services/seo.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'si-ambassador',
  standalone: true,
  imports: [CommonModule, TranslateModule, LocalizedContentPipe],
  templateUrl: './ambassador.html',
  styleUrl: './ambassador.scss'
})
export class Ambassador implements OnInit {

  private readonly institutionalService = inject(InstitutionalService);
  private readonly seoService = inject(SeoService);
  private readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly page = signal<SitePage | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.institutionalService.getAmbassador()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: p => {
          this.page.set(p);
          this.loading.set(false);
          this.updateSeo(p);
        },
        error: () => this.loading.set(false)
      });
  }

  private updateSeo(p: SitePage): void {
    const idioma = this.langService.getIdiomaKey();
    const tr = p.translations.find(t => t.idioma === idioma) ?? p.translations[0];
    if (tr) {
      this.seoService.updateMeta({
        title: tr.metaTitulo || tr.titulo,
        description: tr.metaDescricao || tr.excerto,
        keywords: tr.metaKeywords,
        ogImage: tr.ogImageUrl,
        ogType: 'profile',
        canonicalUrl: `https://www.angola-botschaft.de/embaixador`
      });

      this.seoService.setStructuredData(this.seoService.getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: tr.titulo, url: '/embaixador' }
      ]));
    }
  }
}
