import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'si-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="not-found">
      <div class="container not-found__inner">
        <span class="not-found__code">404</span>
        <h1 class="not-found__title">{{ 'not_found.title' | translate }}</h1>
        <p class="not-found__message">{{ 'not_found.message' | translate }}</p>
        <a routerLink="/" class="btn btn--primary">{{ 'not_found.back_home' | translate }}</a>
      </div>
    </section>
  `,
  styles: [`
    .not-found {
      min-height: 60vh;
      display: flex;
      align-items: center;

      &__inner {
        text-align: center;
        padding: var(--space-3xl) 0;
      }

      &__code {
        font-size: 6rem;
        font-weight: 800;
        color: var(--red);
        line-height: 1;
        opacity: 0.3;
      }

      &__title {
        font-family: var(--font-serif);
        font-size: 2rem;
        margin: var(--space-md) 0;
      }

      &__message {
        color: var(--text-light);
        margin-bottom: var(--space-xl);
      }
    }
  `]
})
export class NotFound {}
