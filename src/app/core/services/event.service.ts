import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SiteEvent } from '../models/event.model';
import { PagedData } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class EventService {

  private readonly api = inject(ApiService);

  getPublishedEvents(page = 0, size = 12, tipo?: string): Observable<PagedData<SiteEvent>> {
    const params: Record<string, string | number> = { page, size };
    if (tipo) { params['tipo'] = tipo; }
    return this.api.getPaged<SiteEvent>('/institutional/events', params);
  }

  getUpcomingEvents(): Observable<SiteEvent[]> {
    return this.api.get<SiteEvent[]>('/institutional/events/upcoming');
  }

  getEventsByDateRange(start: string, end: string): Observable<SiteEvent[]> {
    return this.api.get<SiteEvent[]>('/institutional/events/calendar', { start, end });
  }

  getEventById(id: string): Observable<SiteEvent> {
    return this.api.get<SiteEvent>(`/institutional/events/${id}`);
  }
}
