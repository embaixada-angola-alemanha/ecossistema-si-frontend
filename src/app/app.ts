import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'si-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, Header, Footer],
  template: `
    <a class="skip-link" href="#main-content">{{ 'accessibility.skip_to_content' | translate }}</a>
    <si-header />
    <main id="main-content" role="main">
      <router-outlet />
    </main>
    <si-footer />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main {
      flex: 1;
    }
  `]
})
export class App implements OnInit {

  private readonly langService = inject(LanguageService);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.langService.init();
    this.seoService.init();
    this.seoService.setStructuredData(this.seoService.getOrganizationSchema());
  }
}
