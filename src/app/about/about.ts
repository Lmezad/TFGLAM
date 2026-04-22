import { Component } from '@angular/core';
import { Countdown } from '../countdown/countdown';
import { Header } from '../header/header';

@Component({
  selector: 'app-about',
  imports: [Countdown, Header],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}

