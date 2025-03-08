import { Component } from '@angular/core';
import { MenubarComponent } from './component/menubar/menubar.component';
import { OverviewMenuComponent } from './component/overview-menu/overview-menu.component';
import { YahooFinanceChartComponent } from './component/yahoo-finance-chart/yahoo-finance-chart.component';
import { PpXmlFileUploaderComponent } from './component/pp-xml-file-uploader/pp-xml-file-uploader.component';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    MenubarComponent,
    OverviewMenuComponent,
    YahooFinanceChartComponent,
    PpXmlFileUploaderComponent,
    Divider,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fanalyzer';
}
