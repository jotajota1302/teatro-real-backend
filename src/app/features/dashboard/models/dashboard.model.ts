export interface Stat {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export interface Activity {
  title: string;
  location: string;
  time: string;
  type: string;
  color: string;
}

export interface Event {
  title: string;
  date: string;
}

export interface DashboardOverviewResponse {
  stats: Stat[];
  todayActivities: Activity[];
  upcomingEvents: Event[];
}
