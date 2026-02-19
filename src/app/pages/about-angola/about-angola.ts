import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstitutionalService } from '@core/services/institutional.service';
import { SitePage } from '@core/models/page.model';
import { LocalizedContentPipe } from '@shared/pipes/localized-content.pipe';

@Component({
  selector: 'si-about-angola',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedContentPipe],
  templateUrl: './about-angola.html',
  styleUrl: './about-angola.scss'
})
export class AboutAngola implements OnInit {

  private readonly institutionalService = inject(InstitutionalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly page = signal<SitePage | null>(null);
  readonly loading = signal(true);

  readonly subsections = [
    { slug: 'presidente', icon: 'person' },
    { slug: 'poderes', icon: 'account_balance' },
    { slug: 'geografia', icon: 'terrain' },
    { slug: 'historia', icon: 'history_edu' },
    { slug: 'demografia', icon: 'groups' },
    { slug: 'economia', icon: 'trending_up' },
    { slug: 'cultura', icon: 'palette' },
    { slug: 'simbolos', icon: 'flag' }
  ];

  ngOnInit(): void {
    this.institutionalService.getAboutAngola()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: p => { this.page.set(p); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }
}
