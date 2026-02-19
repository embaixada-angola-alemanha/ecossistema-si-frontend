import { Component, inject, signal, OnInit, DestroyRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstitutionalService } from '@core/services/institutional.service';
import { SitePage } from '@core/models/page.model';
import { LocalizedContentPipe } from '@shared/pipes/localized-content.pipe';

@Component({
  selector: 'si-about-angola-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedContentPipe],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>{{ 'about_angola.sections.' + subsection() | translate }}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <a routerLink="/sobre-angola" class="back-link">
          <span class="material-icons-outlined">arrow_back</span>
          {{ 'about_angola.title' | translate }}
        </a>

        @if (loading()) {
          <p class="loading-text">{{ 'common.loading' | translate }}</p>
        } @else if (page()) {
          <article class="page-content">
            <h2 class="page-content__title">{{ page()!.translations | localizedContent:'titulo' }}</h2>
            <div class="page-content__body" [innerHTML]="page()!.translations | localizedContent:'conteudo'"></div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    @use '../shared-page';

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
  `]
})
export class AboutAngolaDetail implements OnInit {

  private readonly institutionalService = inject(InstitutionalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly subsection = input.required<string>();
  readonly page = signal<SitePage | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.institutionalService.getAboutAngolaSubsection(this.subsection())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: p => { this.page.set(p); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }
}
