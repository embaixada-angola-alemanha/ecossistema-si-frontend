import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SitePage } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class PageService {

  private readonly api = inject(ApiService);

  getPublishedPages(tipo?: string): Observable<SitePage[]> {
    const params: Record<string, string> = {};
    if (tipo) { params['tipo'] = tipo; }
    return this.api.get<SitePage[]>('/pages', params);
  }

  getPageBySlug(slug: string): Observable<SitePage> {
    return this.api.get<SitePage>(`/pages/${slug}`);
  }
}
