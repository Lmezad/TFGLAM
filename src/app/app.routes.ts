import { Routes } from '@angular/router';
import { Player } from './player/player';
import { About } from './about/about';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'player' },
  { path: 'player', component: Player },
  { path: 'about', component: About },

];
