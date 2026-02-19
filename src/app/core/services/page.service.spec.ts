import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PageService } from './page.service';

describe('PageService', () => {
  let service: PageService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PageService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /pages for getPublishedPages', () => {
    service.getPublishedPages().subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/pages'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [], message: '', timestamp: '' });
  });

  it('should include tipo param when provided to getPublishedPages', () => {
    service.getPublishedPages('NEWS').subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/pages'));
    expect(req.request.params.get('tipo')).toBe('NEWS');
    req.flush({ success: true, data: [], message: '', timestamp: '' });
  });

  it('should call GET /pages/{slug} for getPageBySlug', () => {
    service.getPageBySlug('sobre-angola').subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/pages/sobre-angola'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: {}, message: '', timestamp: '' });
  });
});
