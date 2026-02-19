import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstitutionalService } from '@core/services/institutional.service';
import { SitePage } from '@core/models/page.model';
import { LocalizedContentPipe } from '@shared/pipes/localized-content.pipe';

@Component({
  selector: 'si-bilateral',
  standalone: true,
  imports: [CommonModule, TranslateModule, LocalizedContentPipe],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>{{ 'bilateral.title' | translate }}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
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
  styles: [`@use '../shared-page';`]
})
export class Bilateral implements OnInit {

  private readonly institutionalService = inject(InstitutionalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly page = signal<SitePage | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.institutionalService.getBilateralRelations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: p => { this.page.set(p); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }
}
