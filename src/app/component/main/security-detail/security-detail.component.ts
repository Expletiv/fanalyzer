import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { YahooFinanceChartComponent } from '../yahoo-finance-chart/yahoo-finance-chart.component';
import { Button } from 'primeng/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-security-detail',
  imports: [
    YahooFinanceChartComponent,
    Button
  ],
  templateUrl: './security-detail.component.html',
  styleUrl: './security-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityDetailComponent {
  protected readonly location: Location = inject(Location);

  symbol: InputSignal<string> = input.required<string>();
}
