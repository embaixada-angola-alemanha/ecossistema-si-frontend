import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';
import { PageTranslation } from '@core/models/page.model';
import { SiteEvent } from '@core/models/event.model';

@Pipe({
  name: 'localizedContent',
  standalone: true,
  pure: false
})
export class LocalizedContentPipe implements PipeTransform {

  private readonly langService = inject(LanguageService);

  transform(translations: PageTranslation[] | undefined, field: 'titulo' | 'conteudo' | 'excerto'): string {
    if (!translations || translations.length === 0) return '';

    const idioma = this.langService.getIdiomaKey();
    const found = translations.find(t => t.idioma === idioma);
    const fallback = translations.find(t => t.idioma === 'PT') ?? translations[0];
    const translation = found ?? fallback;

    return translation[field] ?? '';
  }
}

@Pipe({
  name: 'localizedEvent',
  standalone: true,
  pure: false
})
export class LocalizedEventPipe implements PipeTransform {

  private readonly langService = inject(LanguageService);

  transform(event: SiteEvent | null | undefined, field: string): string {
    if (!event) return '';
    const lang = this.langService.currentLang();
    const suffix = lang === 'pt' ? 'Pt' : lang === 'en' ? 'En' : lang === 'de' ? 'De' : 'Cs';
    const value = event[field + suffix] as string;
    return value || (event[field + 'Pt'] as string) || '';
  }
}

@Pipe({
  name: 'stripHtml',
  standalone: true
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/<[^>]*>/g, '').trim();
  }
}
