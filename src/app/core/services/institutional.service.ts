import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SitePage } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class InstitutionalService {

  private readonly api = inject(ApiService);

  getAmbassador(): Observable<SitePage> {
    return this.api.get<SitePage>('/institutional/embaixador');
  }

  getAboutAngola(): Observable<SitePage> {
    return this.api.get<SitePage>('/institutional/sobre-angola');
  }

  getAboutAngolaSubsection(subsection: string): Observable<SitePage> {
    return this.api.get<SitePage>(`/institutional/sobre-angola/${subsection}`);
  }

  getBilateralRelations(): Observable<SitePage> {
    return this.api.get<SitePage>('/institutional/relacoes-bilaterais');
  }
}
