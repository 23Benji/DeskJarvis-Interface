import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard';
import { HomescreenComponent } from './homescreen/homescreen';
import { GamesComponent } from './games/games';
import { MatrixEffectComponent } from './matrix-effect/matrix-effect';
import { SettingsComponent } from './settings/settings';
import { IntroComponent } from './intro/intro';
import { TutorialComponent } from './tutorial/tutorial';

export const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    canActivate: [() => {
      const router = inject(Router);

      // 1. Check if Intro was seen
      if (sessionStorage.getItem('introShown')) {

        // 2. If Intro done, check if Tutorial was seen
        if (sessionStorage.getItem('tutorialShown')) {
          return router.parseUrl('/home'); // Both done -> Go Home
        } else {
          return router.parseUrl('/tutorial'); // Intro done, Tutorial not -> Go Tutorial
        }
      }

      // 3. Nothing seen -> Play Intro
      return true;
    }]
  },

  { path: 'tutorial', component: TutorialComponent }, // 👈 New Route
  { path: 'home', component: HomescreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'games', component: GamesComponent },
  { path: 'matrix', component: MatrixEffectComponent },
  { path: 'settings', component: SettingsComponent },

  { path: '**', redirectTo: '' }
];
