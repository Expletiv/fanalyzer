import { Component } from '@angular/core';
import { MenubarComponent } from './menubar/menubar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MenubarComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fanalyzer';
}
