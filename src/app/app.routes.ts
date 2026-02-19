import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    data: { title: 'home.title' }
  },
  {
    path: 'embaixador',
    loadComponent: () => import('./pages/ambassador/ambassador').then(m => m.Ambassador),
    data: { title: 'ambassador.title' }
  },
  {
    path: 'sobre-angola',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/about-angola/about-angola').then(m => m.AboutAngola),
        data: { title: 'about_angola.title' }
      },
      {
        path: ':subsection',
        loadComponent: () => import('./pages/about-angola/about-angola-detail').then(m => m.AboutAngolaDetail),
        data: { title: 'about_angola.title' }
      }
    ]
  },
  {
    path: 'relacoes-bilaterais',
    loadComponent: () => import('./pages/bilateral/bilateral').then(m => m.Bilateral),
    data: { title: 'bilateral.title' }
  },
  {
    path: 'sector-consular',
    loadComponent: () => import('./pages/consular/consular').then(m => m.Consular),
    data: { title: 'consular.title' }
  },
  {
    path: 'eventos',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/events/events-list').then(m => m.EventsList),
        data: { title: 'events.title' }
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/events/event-detail').then(m => m.EventDetail),
        data: { title: 'events.detail' }
      }
    ]
  },
  {
    path: 'contactos',
    loadComponent: () => import('./pages/contacts/contacts').then(m => m.Contacts),
    data: { title: 'contacts.title' }
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
    data: { title: 'not_found.title' }
  }
];
