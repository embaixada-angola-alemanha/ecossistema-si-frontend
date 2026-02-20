import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@core/services/event.service';
import { SiteEvent } from '@core/models/event.model';
import { LocalizedEventPipe, StripHtmlPipe } from '@shared/pipes/localized-content.pipe';
import { LanguageService } from '@core/services/language.service';
import { EventCalendar } from '@shared/components/event-calendar/event-calendar';

@Component({
  selector: 'si-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedEventPipe, StripHtmlPipe, EventCalendar],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss'
})
export class EventsList implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly featuredEvent = signal<SiteEvent | null>(null);
  readonly upcomingEvents = signal<SiteEvent[]>([]);
  readonly pastEvents = signal<SiteEvent[]>([]);
  readonly loading = signal(true);
  readonly pastLoading = signal(false);
  readonly activeTab = signal<'upcoming' | 'calendar' | 'past'>('upcoming');
  readonly pastPage = signal(0);
  readonly pastHasMore = signal(false);

  readonly daysUntilFeatured = computed(() => {
    const event = this.featuredEvent();
    if (!event) return 0;
    const now = new Date();
    const start = new Date(event.dataInicio);
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  });

  readonly isHappeningNow = computed(() => {
    const event = this.featuredEvent();
    if (!event) return false;
    const now = new Date();
    const start = new Date(event.dataInicio);
    const end = event.dataFim ? new Date(event.dataFim) : start;
    return now >= start && now <= end;
  });

  ngOnInit(): void {
    this.loadUpcoming();
  }

  setTab(tab: 'upcoming' | 'calendar' | 'past'): void {
    this.activeTab.set(tab);
    if (tab === 'past' && this.pastEvents().length === 0) {
      this.loadPastEvents();
    }
  }

  loadMorePast(): void {
    this.pastPage.update(p => p + 1);
    this.loadPastEvents();
  }

  private loadUpcoming(): void {
    this.loading.set(true);
    this.eventService.getUpcomingEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: events => {
          if (events.length > 0) {
            this.featuredEvent.set(events[0]);
            this.upcomingEvents.set(events.slice(1));
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  private loadPastEvents(): void {
    this.pastLoading.set(true);
    this.eventService.getPublishedEvents(this.pastPage(), 12)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          const now = new Date().toISOString();
          const past = data.content.filter(e => e.dataInicio < now);
          this.pastEvents.update(prev => [...prev, ...past]);
          this.pastHasMore.set(!data.last);
          this.pastLoading.set(false);
        },
        error: () => this.pastLoading.set(false)
      });
  }
}
