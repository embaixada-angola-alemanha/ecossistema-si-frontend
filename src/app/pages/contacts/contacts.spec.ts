import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Contacts } from './contacts';

describe('Contacts', () => {
  let component: Contacts;
  let fixture: ComponentFixture<Contacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contacts, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(Contacts, {
        set: { template: '<div>contacts works</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Contacts);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty contacts and loading true', () => {
    expect(component.contacts()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it('should return horarioPt as default in getHorario', () => {
    const contact = {
      id: '1', departamento: 'Test', endereco: '', cidade: '', codigoPostal: '',
      pais: '', telefone: '', fax: '', email: '',
      horarioPt: 'Seg-Sex 9-17', horarioEn: '', horarioDe: '',
      latitude: null, longitude: null, sortOrder: 0, activo: true,
      createdAt: '', updatedAt: '',
    };
    const result = component.getHorario(contact);
    expect(result).toBe('Seg-Sex 9-17');
  });
});
