import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@core/services/event.service';
import { SiteEvent } from '@core/models/event.model';
import { LocalizedEventPipe } from '@shared/pipes/localized-content.pipe';
import { LanguageService } from '@core/services/language.service';

export interface CalendarDay {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: SiteEvent[];
}

@Component({
  selector: 'si-event-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LocalizedEventPipe],
  template: `
    <div class="cal">
      <!-- Header -->
      <div class="cal__header">
        <button class="cal__nav-btn" (click)="prevMonth()" aria-label="Previous month">
          <span class="material-icons-outlined">chevron_left</span>
        </button>
        <h3 class="cal__month-label">{{ monthLabel() }}</h3>
        <button class="cal__today-btn" (click)="goToToday()">
          {{ 'events.calendar_today' | translate }}
        </button>
        <button class="cal__nav-btn" (click)="nextMonth()" aria-label="Next month">
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="cal__grid cal__grid--header">
        @for (day of weekdayHeaders(); track day) {
          <div class="cal__weekday">{{ day }}</div>
        }
      </div>

      <!-- Day Cells -->
      <div class="cal__grid">
        @for (day of calendarDays(); track day.date) {
          <button class="cal__day"
                  [class.cal__day--outside]="!day.isCurrentMonth"
                  [class.cal__day--today]="day.isToday"
                  [class.cal__day--has-events]="day.events.length > 0"
                  [class.cal__day--selected]="selectedDay()?.date === day.date"
                  [disabled]="!day.isCurrentMonth || day.events.length === 0"
                  (click)="selectDay(day)">
            <span class="cal__day-number">{{ day.dayOfMonth }}</span>
            @if (day.events.length > 0) {
              <div class="cal__day-dots">
                @for (e of day.events.slice(0, 3); track e.id) {
                  <span class="cal__dot"></span>
                }
              </div>
            }
          </button>
        }
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="cal__loading">{{ 'common.loading' | translate }}</div>
      }

      <!-- Selected Day Detail -->
      @if (selectedDay(); as day) {
        <div class="cal__detail">
          <h4 class="cal__detail-date">
            {{ day.date }}
            <span class="cal__detail-count">({{ day.events.length }})</span>
          </h4>
          <div class="cal__detail-events">
            @for (event of day.events; track event.id) {
              <a [routerLink]="['/eventos', event.id]" class="cal__event-card">
                <div class="cal__event-time">
                  {{ event.dataInicio | date:'HH:mm' }}
                </div>
                <div class="cal__event-body">
                  <h5 class="cal__event-title">{{ event | localizedEvent:'titulo' }}</h5>
                  @if (event | localizedEvent:'local'; as location) {
                    <span class="cal__event-location">
                      <span class="material-icons-outlined">place</span>
                      {{ location }}
                    </span>
                  }
                </div>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cal {
      margin-top: var(--space-md);
    }

    .cal__header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .cal__month-label {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 600;
      text-transform: capitalize;
      flex: 1;
      margin: 0;
    }

    .cal__nav-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--white);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition);
      .material-icons-outlined { font-size: 20px; }
      &:hover { border-color: var(--gold-accent); color: var(--gold-accent); }
    }

    .cal__today-btn {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 500;
      padding: 4px 12px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: none;
      cursor: pointer;
      color: var(--text-light);
      transition: all var(--transition);
      &:hover { border-color: var(--gold-accent); color: var(--gold-accent); }
    }

    .cal__grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;

      &--header { margin-bottom: 4px; }
    }

    .cal__weekday {
      text-align: center;
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-light);
      padding: var(--space-sm) 0;
    }

    .cal__day {
      aspect-ratio: 1;
      border: none;
      background: var(--white);
      border-radius: 4px;
      cursor: default;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      transition: all var(--transition);
      padding: 0;

      &--outside {
        opacity: 0.25;
      }

      &--today .cal__day-number {
        background: var(--red);
        color: var(--white);
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &--has-events {
        cursor: pointer;
        &:hover { background: var(--cream); }
      }

      &--selected {
        background: var(--cream);
        outline: 2px solid var(--gold-accent);
        outline-offset: -2px;
      }
    }

    .cal__day-number {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      color: var(--text);
    }

    .cal__day--has-events .cal__day-number {
      font-weight: 700;
    }

    .cal__day-dots {
      display: flex;
      gap: 3px;
    }

    .cal__dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--gold-accent);
    }

    .cal__loading {
      text-align: center;
      color: var(--text-light);
      padding: var(--space-md);
      font-size: 0.875rem;
    }

    .cal__detail {
      margin-top: var(--space-xl);
      padding: var(--space-xl);
      background: var(--cream);
      border-radius: 4px;
      border: 1px solid var(--border);
    }

    .cal__detail-date {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 var(--space-md) 0;
    }

    .cal__detail-count {
      font-weight: 400;
      color: var(--text-light);
    }

    .cal__detail-events {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .cal__event-card {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--white);
      border: 1px solid var(--border);
      border-left: 3px solid var(--gold-accent);
      border-radius: 0 3px 3px 0;
      text-decoration: none;
      color: var(--text);
      transition: all var(--transition);

      &:hover {
        border-left-color: var(--red);
        box-shadow: 0 2px 8px var(--shadow);
        text-decoration: none;
        color: var(--text);
      }
    }

    .cal__event-time {
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--gold-accent);
      min-width: 48px;
      padding-top: 2px;
    }

    .cal__event-body { flex: 1; min-width: 0; }

    .cal__event-title {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }

    .cal__event-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--text-light);
      .material-icons-outlined { font-size: 14px; color: var(--gold-accent); }
    }

    @media (max-width: 768px) {
      .cal__day {
        aspect-ratio: auto;
        padding: var(--space-sm) 0;
      }
      .cal__day-number { font-size: 0.75rem; }
      .cal__dot { width: 4px; height: 4px; }
    }
  `]
})
export class EventCalendar implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentMonth = signal(new Date());
  readonly calendarDays = signal<CalendarDay[]>([]);
  readonly selectedDay = signal<CalendarDay | null>(null);
  readonly loading = signal(false);

  readonly monthLabel = computed(() => {
    const d = this.currentMonth();
    const lang = this.langService.currentLang();
    const locale = lang === 'cs' ? 'pt' : lang;
    return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  });

  readonly weekdayHeaders = computed(() => {
    const lang = this.langService.currentLang();
    const locale = lang === 'cs' ? 'pt' : lang;
    const days: string[] = [];
    // Start from Monday (ISO week)
    for (let i = 0; i < 7; i++) {
      const d = new Date(2024, 0, i + 1); // 2024-01-01 is Monday
      days.push(d.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 3));
    }
    return days;
  });

  ngOnInit(): void {
    this.buildMonth();
  }

  prevMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    this.buildMonth();
  }

  nextMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    this.buildMonth();
  }

  goToToday(): void {
    this.currentMonth.set(new Date());
    this.buildMonth();
  }

  selectDay(day: CalendarDay): void {
    if (day.events.length === 0 || !day.isCurrentMonth) return;
    this.selectedDay.set(
      this.selectedDay()?.date === day.date ? null : day
    );
  }

  private buildMonth(): void {
    this.loading.set(true);
    this.selectedDay.set(null);

    const d = this.currentMonth();
    const year = d.getFullYear();
    const month = d.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    this.eventService.getEventsByDateRange(start.toISOString(), end.toISOString())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: events => {
          this.calendarDays.set(this.generateDays(year, month, events));
          this.loading.set(false);
        },
        error: () => {
          this.calendarDays.set(this.generateDays(year, month, []));
          this.loading.set(false);
        }
      });
  }

  private generateDays(year: number, month: number, events: SiteEvent[]): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get Monday-based day of week (0=Mon, 6=Sun)
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const dateStr = this.formatDate(year, month - 1, dayNum);
      days.push({
        date: dateStr,
        dayOfMonth: dayNum,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = this.formatDate(year, month, d);
      const dayEvents = events.filter(e => {
        const eStart = e.dataInicio.slice(0, 10);
        const eEnd = e.dataFim ? e.dataFim.slice(0, 10) : eStart;
        return dateStr >= eStart && dateStr <= eEnd;
      });

      days.push({
        date: dateStr,
        dayOfMonth: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        events: dayEvents
      });
    }

    // Next month padding (fill to 42 cells = 6 rows)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = this.formatDate(year, month + 1, d);
      days.push({
        date: dateStr,
        dayOfMonth: d,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }

    return days;
  }

  private formatDate(year: number, month: number, day: number): string {
    const d = new Date(year, month, day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
