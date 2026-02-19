import { Component, inject, signal, OnInit, DestroyRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@core/services/event.service';
import { SiteEvent } from '@core/models/event.model';
import { LocalizedEventPipe } from '@shared/pipes/localized-content.pipe';
import { SeoService } from '@core/services/seo.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'si-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedEventPipe],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>{{ 'events.detail' | translate }}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <a routerLink="/eventos" class="back-link">
          <span class="material-icons-outlined">arrow_back</span>
          {{ 'events.title' | translate }}
        </a>

        @if (loading()) {
          <p class="loading-text">{{ 'common.loading' | translate }}</p>
        } @else if (event()) {
          <article class="event-detail">
            <h2 class="event-detail__title">{{ event() | localizedEvent:'titulo' }}</h2>

            <div class="event-detail__meta">
              <div class="event-detail__meta-item">
                <span class="material-icons-outlined">event</span>
                <span>{{ event()!.dataInicio | date:'dd MMM yyyy, HH:mm' }}</span>
                @if (event()!.dataFim) {
                  <span>— {{ event()!.dataFim | date:'dd MMM yyyy, HH:mm' }}</span>
                }
              </div>
              @if (event() | localizedEvent:'local') {
                <div class="event-detail__meta-item">
                  <span class="material-icons-outlined">place</span>
                  <span>{{ event() | localizedEvent:'local' }}</span>
                </div>
              }
              @if (event()!.tipoEvento) {
                <div class="event-detail__meta-item">
                  <span class="material-icons-outlined">category</span>
                  <span>{{ event()!.tipoEvento }}</span>
                </div>
              }
            </div>

            <div class="page-content__body" [innerHTML]="event() | localizedEvent:'descricao'"></div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    @import '../shared-page';

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-bottom: var(--space-lg);
      font-size: 0.875rem;
      color: var(--red);
      .material-icons-outlined { font-size: 18px; }
      &:hover { text-decoration: none; }
    }

    .event-detail {
      max-width: 800px;

      &__title {
        font-family: var(--font-serif);
        font-size: 2rem;
        margin-bottom: var(--space-lg);
      }

      &__meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-lg);
        margin-bottom: var(--space-xl);
        padding-bottom: var(--space-lg);
        border-bottom: 1px solid var(--border);
      }

      &__meta-item {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: 0.9rem;
        color: var(--text-light);

        .material-icons-outlined {
          font-size: 20px;
          color: var(--red);
        }
      }
    }
  `]
})
export class EventDetail implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly seoService = inject(SeoService);
  private readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input.required<string>();
  readonly event = signal<SiteEvent | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.eventService.getEventById(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: e => {
          this.event.set(e);
          this.loading.set(false);
          this.updateSeo(e);
        },
        error: () => this.loading.set(false)
      });
  }

  private updateSeo(e: SiteEvent): void {
    const lang = this.langService.currentLang();
    const title = lang === 'en' ? e.tituloEn : lang === 'de' ? e.tituloDe : e.tituloPt;
    const desc = lang === 'en' ? e.descricaoEn : lang === 'de' ? e.descricaoDe : e.descricaoPt;
    const location = lang === 'en' ? e.localEn : e.localPt;

    this.seoService.updateMeta({
      title: title || e.tituloPt,
      description: (desc || e.descricaoPt || '').substring(0, 160),
      ogType: 'article',
      canonicalUrl: `https://www.angola-botschaft.de/eventos/${e.id}`
    });

    this.seoService.setStructuredData(this.seoService.getEventSchema({
      title: title || e.tituloPt,
      description: desc || e.descricaoPt || '',
      startDate: e.dataInicio,
      endDate: e.dataFim ?? undefined,
      location: location || e.localPt || '',
      url: `https://www.angola-botschaft.de/eventos/${e.id}`
    }));
  }
}
