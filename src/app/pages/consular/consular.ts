import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'si-consular',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>{{ 'consular.title' | translate }}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="services-grid">
          <div class="service-card">
            <span class="material-icons-outlined service-card__icon">badge</span>
            <h3 class="service-card__title">{{ 'consular.visas' | translate }}</h3>
          </div>
          <div class="service-card">
            <span class="material-icons-outlined service-card__icon">menu_book</span>
            <h3 class="service-card__title">{{ 'consular.passports' | translate }}</h3>
          </div>
          <div class="service-card">
            <span class="material-icons-outlined service-card__icon">family_restroom</span>
            <h3 class="service-card__title">{{ 'consular.civil_registry' | translate }}</h3>
          </div>
          <div class="service-card">
            <span class="material-icons-outlined service-card__icon">gavel</span>
            <h3 class="service-card__title">{{ 'consular.notarial' | translate }}</h3>
          </div>
          <div class="service-card">
            <span class="material-icons-outlined service-card__icon">event</span>
            <h3 class="service-card__title">{{ 'consular.appointments' | translate }}</h3>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use '../shared-page';

    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
    }

    .service-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--space-2xl) var(--space-lg);
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: 4px;
      transition: all var(--transition);

      &:hover {
        border-color: var(--red);
        box-shadow: 0 4px 16px var(--shadow);
      }

      &__icon {
        font-size: 40px;
        color: var(--red);
        margin-bottom: var(--space-md);
      }

      &__title {
        font-family: var(--font-serif);
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Consular {}
