import { Routes } from '@angular/router';
import { ElectestComponent } from './electest/electest.component';
import { Player } from './player/player';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'player' },
  { path: 'player', component: Player },
  { path: 'electest', component: ElectestComponent }
];
