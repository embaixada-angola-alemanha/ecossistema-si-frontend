import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService, LANGUAGES, LangCode } from '@core/services/language.service';
import { MenuService } from '@core/services/menu.service';
import { MenuItem } from '@core/models/menu.model';

@Component({
  selector: 'si-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  private readonly menuService = inject(MenuService);
  private readonly destroyRef = inject(DestroyRef);
  readonly langService = inject(LanguageService);

  readonly menuItems = signal<MenuItem[]>([]);
  readonly mobileMenuOpen = signal(false);
  readonly languages = LANGUAGES;

  ngOnInit(): void {
    this.menuService.getMenu('HEADER')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: menu => this.menuItems.set(menu.items.filter(i => i.activo)),
        error: () => this.menuItems.set([])
      });
  }

  getLabel(item: MenuItem): string {
    const lang = this.langService.currentLang();
    switch (lang) {
      case 'en': return item.labelEn || item.labelPt;
      case 'de': return item.labelDe || item.labelPt;
      case 'cs': return item.labelCs || item.labelPt;
      default: return item.labelPt;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  changeLang(lang: LangCode): void {
    this.langService.setLang(lang);
  }
}
