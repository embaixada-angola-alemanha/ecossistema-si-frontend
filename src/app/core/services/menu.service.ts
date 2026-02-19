import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Menu } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  private readonly api = inject(ApiService);

  getMenu(localizacao: 'HEADER' | 'FOOTER' | 'SIDEBAR'): Observable<Menu> {
    return this.api.get<Menu>(`/menus/${localizacao}`);
  }
}
