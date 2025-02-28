import { Component } from '@angular/core';
import { MenubarComponent } from './menubar/menubar.component';
import { OverviewMenuComponent } from './overview-menu/overview-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MenubarComponent,
    OverviewMenuComponent,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fanalyzer';
}
