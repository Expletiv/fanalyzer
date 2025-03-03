import { Component } from '@angular/core';
import { MenubarComponent } from './component/menubar/menubar.component';
import { OverviewMenuComponent } from './component/overview-menu/overview-menu.component';
import { YahooFinanceChartComponent } from './component/simple-chart/yahoo-finance-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    MenubarComponent,
    OverviewMenuComponent,
    YahooFinanceChartComponent,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fanalyzer';
}
