import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactInfo } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private readonly api = inject(ApiService);

  getActiveContacts(): Observable<ContactInfo[]> {
    return this.api.get<ContactInfo[]>('/institutional/contacts');
  }
}
