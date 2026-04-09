import { Component } from '@angular/core';

@Component({
  selector: 'app-electest',
  standalone: true,
  templateUrl: './electest.html',
  styleUrls: ['./electest.css']
})
export class ElectestComponent {

  mensaje = "Pulsa el botón";

  probar() {
    console.log("funciona")
  }
}

declare global {
  interface Window {
    electronAPI: {
      saludo: () => string;
    };
  }
}
