export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  children?: RouteInfo[];
}

export interface RouteGroup {
  title?: string;
  routes: RouteInfo[];
}

export const MENU_ROUTES: RouteGroup[] = [
  {
    routes: [
      { path: '/home', title: 'Vista Global', icon: 'home' }
    ]
  },
  {
    title: 'TEMPO',
    routes: [
      { path: '/espacios', title: 'Espacios', icon: 'location_city' },
      { path: '/calendario', title: 'Calendario', icon: 'calendar_today' },
      { path: '/logistica', title: 'Logística', icon: 'local_shipping' },
      { path: '/carteleria', title: 'Cartelería', icon: 'tv' }
    ]
  },
  {
    title: 'TOPS',
    routes: [
      { path: '/producciones', title: 'Producciones', icon: 'music_note' },
      { path: '/guiones', title: 'Guiones Técnicos', icon: 'description' }
    ]
  }
];
