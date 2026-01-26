import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, // Default route
  // We will add paths for 'games' and 'settings' later
];
