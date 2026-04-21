import { Component } from '@angular/core';
import { Countdown } from '../countdown/countdown';


@Component({
  selector: 'app-about',
  imports: [Countdown],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}

