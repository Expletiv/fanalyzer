import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { isPlatformBrowser, JsonPipe } from '@angular/common';
import { YahooFinanceService } from '../../service/yahoo-finance.service';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProgressBar } from 'primeng/progressbar';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-simple-chart',
  standalone: true,
  imports: [
    UIChart,
    JsonPipe,
    ProgressSpinner,
    ProgressBar,
    Card
  ],
  templateUrl: './simple-chart.component.html',
  styleUrl: './simple-chart.component.css'
})
export class SimpleChartComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private yahooFinance = inject(YahooFinanceService);
  private cd = inject(ChangeDetectorRef);

  protected isLoading: WritableSignal<boolean> = signal(true);
  protected data: WritableSignal<{
    datasets: ChartDataset<'line', { x: number, y: number | null }[]>[]
  }> = signal({datasets: []});
  protected options: ChartOptions = {
    responsive: true,
    // use the internal representation of the data (needed for data decimation)
    parsing: false,
    scales: {
      x: {
        type: 'time',
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)'
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      decimation: {
        // Reduce points for performance
        enabled: true,
        algorithm: 'lttb',
        samples: 500,
        threshold: 1000,
      }
    },
  };

  ngOnInit(): void {
    const symbol = 'AAPL';

    this.initChart(symbol);
  }

  private initChart(symbol: "AAPL") {
    Chart.register(...registerables);

    if (isPlatformBrowser(this.platformId)) {
      this.yahooFinance.call('chart', symbol, {
        period1: '2015-05-08',
        return: 'array'
      }, {validateResult: true}).subscribe(
        result => {
          const data = result.quotes.map((quote) => {
            return {
              // chartjs uses milliseconds since epoch internally
              x: new Date(quote.date).getTime(),
              y: quote.close
            }
          });

          this.data.set({
            datasets: [
              {
                label: symbol,
                data: data,
                fill: true,
                borderColor: '#4bc0c0',
                borderWidth: 1.5,
                pointRadius: 0,
                indexAxis: 'x',
                tension: 0,
              }
            ]
          });

          this.isLoading.set(false);
        });

      this.cd.markForCheck();
    }
  }
}
