import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '@core/services/contact.service';
import { ContactInfo } from '@core/models/contact.model';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'si-contacts',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts implements OnInit {

  private readonly contactService = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);
  readonly langService = inject(LanguageService);

  readonly contacts = signal<ContactInfo[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.contactService.getActiveContacts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => { this.contacts.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }

  getHorario(contact: ContactInfo): string {
    const lang = this.langService.currentLang();
    switch (lang) {
      case 'en': return contact.horarioEn || contact.horarioPt;
      case 'de': return contact.horarioDe || contact.horarioPt;
      default: return contact.horarioPt;
    }
  }
}
