import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EventService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /institutional/events with pagination for getPublishedEvents', () => {
    service.getPublishedEvents(0, 12).subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/institutional/events'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('12');
    req.flush({ success: true, data: { content: [], page: 0, size: 12, totalElements: 0, totalPages: 0, last: true }, message: '', timestamp: '' });
  });

  it('should include tipo param when provided to getPublishedEvents', () => {
    service.getPublishedEvents(0, 12, 'CULTURAL').subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/institutional/events'));
    expect(req.request.params.get('tipo')).toBe('CULTURAL');
    req.flush({ success: true, data: { content: [], page: 0, size: 12, totalElements: 0, totalPages: 0, last: true }, message: '', timestamp: '' });
  });

  it('should call GET /institutional/events/upcoming for getUpcomingEvents', () => {
    service.getUpcomingEvents().subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/institutional/events/upcoming'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [], message: '', timestamp: '' });
  });

  it('should call GET /institutional/events/{id} for getEventById', () => {
    service.getEventById('abc-123').subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/institutional/events/abc-123'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: {}, message: '', timestamp: '' });
  });
});
