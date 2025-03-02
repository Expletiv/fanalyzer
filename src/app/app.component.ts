import { Component } from '@angular/core';
import { MenubarComponent } from './component/menubar/menubar.component';
import { OverviewMenuComponent } from './component/overview-menu/overview-menu.component';
import { SimpleChartComponent } from './component/simple-chart/simple-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    MenubarComponent,
    OverviewMenuComponent,
    SimpleChartComponent,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fanalyzer';
}
