import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { EventService } from '@core/services/event.service';
import { PageService } from '@core/services/page.service';
import { SiteEvent } from '@core/models/event.model';
import { SitePage } from '@core/models/page.model';
import { LocalizedEventPipe, LocalizedContentPipe } from '@shared/pipes/localized-content.pipe';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'si-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedEventPipe, LocalizedContentPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly pageService = inject(PageService);
  private readonly seoService = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly upcomingEvents = signal<SiteEvent[]>([]);
  readonly highlights = signal<SitePage[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Embaixada da Republica de Angola na Alemanha',
      description: 'Site oficial da Embaixada da Republica de Angola na Republica Federal da Alemanha. Servicos consulares, informacoes sobre Angola e relacoes bilaterais.',
      ogType: 'website',
      canonicalUrl: 'https://www.angola-botschaft.de/'
    });

    forkJoin({
      events: this.eventService.getUpcomingEvents(),
      pages: this.pageService.getPublishedPages('NEWS')
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ events, pages }) => {
          this.upcomingEvents.set(events.slice(0, 3));
          this.highlights.set(pages.slice(0, 3));
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
