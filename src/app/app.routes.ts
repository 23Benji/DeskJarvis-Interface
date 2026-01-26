import { Routes, Router } from '@angular/router'; // 👈 Import Router
import { inject } from '@angular/core';           // 👈 Import inject
import { DashboardComponent } from './dashboard/dashboard';
import { HomescreenComponent } from './homescreen/homescreen';
import { Games } from './games/games';
import { MatrixEffectComponent } from './matrix-effect/matrix-effect';
import { SettingsComponent } from './settings/settings';
import { IntroComponent } from './intro/intro';

export const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    // 👇 The Guard Logic
    canActivate: [() => {
      const router = inject(Router);
      // Check if we remember showing the intro
      if (sessionStorage.getItem('introShown')) {
        // If yes, go straight to Home
        return router.parseUrl('/home');
      }
      // If no, allow the Intro to play
      return true;
    }]
  },

  { path: 'home', component: HomescreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'games', component: Games },
  { path: 'matrix', component: MatrixEffectComponent },
  { path: 'settings', component: SettingsComponent },

  { path: '**', redirectTo: '' }
];
