import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EventsList } from './events-list';

describe('EventsList', () => {
  let component: EventsList;
  let fixture: ComponentFixture<EventsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsList, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
      .overrideComponent(EventsList, {
        set: { template: '<div>events list works</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EventsList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals with default values', () => {
    expect(component.events()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.page()).toBe(0);
    expect(component.hasMore()).toBe(false);
  });

  it('should increment page on loadMore', () => {
    // loadMore calls page.update and loadEvents, but since we override
    // the template, the HTTP call from ngOnInit won't affect the template
    expect(component.page()).toBe(0);
    component.loadMore();
    expect(component.page()).toBe(1);
  });
});
