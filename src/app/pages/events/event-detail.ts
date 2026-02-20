import { Component, inject, signal, computed, effect, DestroyRef, input } from '@angular/core';
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
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss'
})
export class EventDetail {

  private readonly eventService = inject(EventService);
  private readonly seoService = inject(SeoService);
  private readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input.required<string>();
  readonly event = signal<SiteEvent | null>(null);
  readonly relatedEvents = signal<SiteEvent[]>([]);
  readonly loading = signal(true);

  readonly isPastEvent = computed(() => {
    const e = this.event();
    if (!e) return false;
    const end = e.dataFim ? new Date(e.dataFim) : new Date(e.dataInicio);
    return end < new Date();
  });

  readonly isHappeningNow = computed(() => {
    const e = this.event();
    if (!e) return false;
    const now = new Date();
    const start = new Date(e.dataInicio);
    const end = e.dataFim ? new Date(e.dataFim) : start;
    return now >= start && now <= end;
  });

  readonly calendarUrl = computed(() => {
    const e = this.event();
    if (!e) return '';
    const start = e.dataInicio.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = e.dataFim
      ? e.dataFim.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
      : start;
    const title = encodeURIComponent(e.tituloPt);
    const location = encodeURIComponent(e.localPt || '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}`;
  });

  constructor() {
    effect(() => {
      const eventId = this.id();
      this.loadEvent(eventId);
    });
  }

  encodeLocation(location: string): string {
    return encodeURIComponent(location);
  }

  private loadEvent(eventId: string): void {
    this.loading.set(true);
    this.event.set(null);
    this.relatedEvents.set([]);

    this.eventService.getEventById(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: e => {
          this.event.set(e);
          this.loading.set(false);
          this.updateSeo(e);
          this.loadRelated(e);
        },
        error: () => this.loading.set(false)
      });
  }

  private loadRelated(current: SiteEvent): void {
    this.eventService.getUpcomingEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: events => {
          this.relatedEvents.set(
            events.filter(e => e.id !== current.id).slice(0, 3)
          );
        }
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
