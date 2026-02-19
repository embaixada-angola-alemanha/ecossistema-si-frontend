import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MenuService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /menus/HEADER for getMenu HEADER', () => {
    service.getMenu('HEADER').subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/menus/HEADER'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { id: '1', nome: 'Main', localizacao: 'HEADER', activo: true, items: [] }, message: '', timestamp: '' });
  });

  it('should call GET /menus/FOOTER for getMenu FOOTER', () => {
    service.getMenu('FOOTER').subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/menus/FOOTER'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { id: '2', nome: 'Footer', localizacao: 'FOOTER', activo: true, items: [] }, message: '', timestamp: '' });
  });
});
