import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@core/services/event.service';
import { SiteEvent } from '@core/models/event.model';
import { LocalizedEventPipe } from '@shared/pipes/localized-content.pipe';

@Component({
  selector: 'si-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedEventPipe],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss'
})
export class EventsList implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);

  readonly events = signal<SiteEvent[]>([]);
  readonly loading = signal(true);
  readonly page = signal(0);
  readonly hasMore = signal(false);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.eventService.getPublishedEvents(this.page(), 12)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.events.update(current => [...current, ...data.content]);
          this.hasMore.set(!data.last);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  loadMore(): void {
    this.page.update(p => p + 1);
    this.loadEvents();
  }
}
