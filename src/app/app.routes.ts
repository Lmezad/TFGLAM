import { Routes } from '@angular/router';
import { Player } from './player/player';
import { About } from './about/about';
import { Countdown } from './countdown/countdown';
import { Header } from './header/header';
import { Coolplayer } from './coolplayer/coolplayer';

export const routes: Routes = [

  { path: '', component: Coolplayer },
  { path: 'about', component: About },
  { path: 'countdown', component: Countdown },
  { path: 'header', component: Header },
  { path: 'player', component: Player },
  { path: 'coolplayer', component: Coolplayer },

];
