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
    expect(component.upcomingEvents()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.pastPage()).toBe(0);
    expect(component.pastHasMore()).toBe(false);
  });

  it('should increment pastPage on loadMorePast', () => {
    expect(component.pastPage()).toBe(0);
    component.loadMorePast();
    expect(component.pastPage()).toBe(1);
  });
});
