import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ContactService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /institutional/contacts for getActiveContacts', () => {
    const mockContacts = [
      { id: '1', departamento: 'Consular', email: 'consular@test.com' },
    ];

    service.getActiveContacts().subscribe(result => {
      expect(result).toEqual(mockContacts);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/institutional/contacts'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockContacts, message: '', timestamp: '' });
  });
});
