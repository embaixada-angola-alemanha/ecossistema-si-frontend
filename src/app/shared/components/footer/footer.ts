import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '@core/services/contact.service';
import { ContactInfo } from '@core/models/contact.model';

@Component({
  selector: 'si-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit {

  private readonly contactService = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);

  readonly contacts = signal<ContactInfo[]>([]);
  readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.contactService.getActiveContacts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => this.contacts.set(data),
        error: () => this.contacts.set([])
      });
  }
}
