import { Routes } from '@angular/router';
import { Player } from './player/player';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'player' },
  { path: 'player', component: Player },

];
