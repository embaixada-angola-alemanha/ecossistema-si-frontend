import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';

export type LangCode = 'pt' | 'en' | 'de' | 'cs';

export interface Language {
  code: LangCode;
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'pt', label: 'Portugues', flag: '🇦🇴' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' }
];

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private readonly translate = inject(TranslateService);

  readonly currentLang = signal<LangCode>(environment.defaultLang as LangCode);
  readonly languages = LANGUAGES;

  init(): void {
    this.translate.addLangs(environment.supportedLangs);
    this.translate.setDefaultLang(environment.defaultLang);

    const saved = localStorage.getItem('si-lang') as LangCode | null;
    const browserLang = this.translate.getBrowserLang() as LangCode;
    const lang = saved ?? (environment.supportedLangs.includes(browserLang) ? browserLang : environment.defaultLang as LangCode);

    this.setLang(lang);
  }

  setLang(lang: LangCode): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('si-lang', lang);
    document.documentElement.lang = lang === 'cs' ? 'pt' : lang;
  }

  getIdiomaKey(): 'PT' | 'EN' | 'DE' | 'CS' {
    return this.currentLang().toUpperCase() as 'PT' | 'EN' | 'DE' | 'CS';
  }
}
