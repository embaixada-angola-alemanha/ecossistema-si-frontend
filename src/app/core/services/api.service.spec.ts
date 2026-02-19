import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request and extract data from ApiResponse', () => {
    const mockData = [{ id: '1', name: 'Test' }];
    service.get('/test').subscribe(result => {
      expect(result).toEqual(mockData);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/test'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockData, message: '', timestamp: '' });
  });

  it('should append query params to GET request', () => {
    service.get('/test', { page: 0, size: 10, active: true }).subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/test'));
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('active')).toBe('true');
    req.flush({ success: true, data: [], message: '', timestamp: '' });
  });

  it('should skip null and undefined params', () => {
    service.get('/test', { page: 0, empty: undefined as unknown as string }).subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/test'));
    expect(req.request.params.has('page')).toBe(true);
    expect(req.request.params.has('empty')).toBe(false);
    req.flush({ success: true, data: [], message: '', timestamp: '' });
  });

  it('should call get for getPaged and return PagedData', () => {
    const mockPaged = { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true };
    service.getPaged('/items', { page: 0, size: 10 }).subscribe(result => {
      expect(result).toEqual(mockPaged);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/items'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockPaged, message: '', timestamp: '' });
  });
});
