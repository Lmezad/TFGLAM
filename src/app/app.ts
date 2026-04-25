import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})


export class AppComponent { }
