import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
  untracked,
  WritableSignal
} from '@angular/core';
import { UIChart } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { YahooFinanceService } from '../../service/yahoo-finance.service';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import { ProgressBar } from 'primeng/progressbar';
import { Card } from 'primeng/card';
import { Tab, TabList, Tabs } from 'primeng/tabs';
import { Skeleton } from 'primeng/skeleton';
import { YahooFinanceChartInterval, YahooFinanceChartRange } from '../../types/yahoo-finance';
import { match } from 'ts-pattern';

@Component({
  selector: 'app-yahoo-finance-chart',
  standalone: true,
  imports: [
    UIChart,
    ProgressBar,
    Card,
    Tabs,
    TabList,
    Tab,
    Skeleton
  ],
  templateUrl: './yahoo-finance-chart.component.html',
  styleUrl: './yahoo-finance-chart.component.css'
})
export class YahooFinanceChartComponent {
  private platformId = inject(PLATFORM_ID);
  private yahooFinance = inject(YahooFinanceService);
  protected supportedRanges = Object.values(YahooFinanceChartRange);

  symbol = input.required<string>();

  /**
   * A date string. Set `range` to `YahooFinanceChartRange.CUSTOM` to use this.
   */
  from = model<string>(DateTime.now().toISODate());

  /**
   * A date string. Set `range` to `YahooFinanceChartRange.CUSTOM` to use this.
   */
  to = model<string>();

  /**
   * The interval between data points. If not specified, a suitable interval will be chosen.
   */
  interval = input<YahooFinanceChartInterval>();

  _interval = computed(() => this.interval() ?? this.computeInterval(this.from(), this.to()));

  /**
   * The range of the data to show. Defaults to `YahooFinanceChartRange.DAY`.
   */
  range = model<YahooFinanceChartRange>(YahooFinanceChartRange.ONE_DAY);

  protected isLoading: WritableSignal<boolean> = signal(true);
  protected rangeOptions: WritableSignal<YahooFinanceChartRange[]> = signal([]);

  protected data: WritableSignal<{
    datasets: ChartDataset<'line', { x: number, y: number | null }[]>[]
  }> = signal({datasets: []});

  protected options: WritableSignal<ChartOptions> = signal({
    responsive: true,
    // use the internal representation of the data (needed for data decimation)
    parsing: false,
    scales: {
      x: {
        // timeseries instead of time, so that the data is not interpolated (e.g. for weekends)
        type: 'timeseries',
        ticks: {
          autoSkipPadding: 50,
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price'
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
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);

      effect(() => {
          this.isLoading.set(true);

          const range = this.range();
          if (range !== YahooFinanceChartRange.CUSTOM) {
            this.from.set(this.computeFrom(range));
            this.to.set(undefined);
          }

          this.yahooFinance.call('chart', this.symbol(), {
            period1: this.from(),
            period2: this.to(),
            interval: this._interval(),
            return: 'array'
          }, {validateResult: true})
            .subscribe(
              result => {
                const data = result.quotes.map((quote) => {
                  return {
                    // chartjs uses milliseconds since epoch internally
                    x: new Date(quote.date).getTime(),
                    y: quote.close
                  }
                });
                this.initData(this.symbol(), data);
                this.initRanges(result.meta.validRanges);
                untracked(() => {
                  this.options.update((opts: any) => {
                    opts.scales.y.title.text = `Price (${result.meta.currency})`;

                    return opts;
                  })
                })

                this.isLoading.set(false);
              });
        }
      );
    }
  }

  private initData(symbol: string, data: { x: number; y: number | null }[]) {
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
  }

  private initRanges(validRanges: string[]) {
    const filteredRanges = validRanges.filter((range) => {
      return this.supportedRanges.includes(range as YahooFinanceChartRange);
    }) as YahooFinanceChartRange[];

    this.rangeOptions.set(filteredRanges);
  }

  private computeFrom(range: Exclude<YahooFinanceChartRange, YahooFinanceChartRange.CUSTOM>): string {
    return match(range)
      .with(YahooFinanceChartRange.ONE_DAY, () => DateTime.now().minus({days: 1}))
      .with(YahooFinanceChartRange.FIVE_DAYS, () => DateTime.now().minus({days: 5}))
      .with(YahooFinanceChartRange.ONE_MONTH, () => DateTime.now().minus({months: 1}))
      .with(YahooFinanceChartRange.THREE_MONTHS, () => DateTime.now().minus({months: 3}))
      .with(YahooFinanceChartRange.SIX_MONTHS, () => DateTime.now().minus({months: 6}))
      .with(YahooFinanceChartRange.ONE_YEAR, () => DateTime.now().minus({years: 1}))
      .with(YahooFinanceChartRange.TWO_YEARS, () => DateTime.now().minus({years: 2}))
      .with(YahooFinanceChartRange.FIVE_YEARS, () => DateTime.now().minus({years: 5}))
      .with(YahooFinanceChartRange.TEN_YEARS, () => DateTime.now().minus({years: 10}))
      .with(YahooFinanceChartRange.YTD, () => DateTime.now().startOf('year'))
      .with(YahooFinanceChartRange.MAX, () => DateTime.now().minus({years: 100}))
      .exhaustive().toISODate();
  }

  private computeInterval(from: string, to: string | undefined): YahooFinanceChartInterval {
    const f = DateTime.fromISO(from);
    const t = to ? DateTime.fromISO(to) : DateTime.now();

    const diff = t.diff(f);
    const timeDiffMs = diff.as('milliseconds');

    const intervalOptions = [
      {interval: YahooFinanceChartInterval.ONE_MINUTE, durationMs: 60000},
      {interval: YahooFinanceChartInterval.TWO_MINUTES, durationMs: 120000},
      {interval: YahooFinanceChartInterval.FIVE_MINUTES, durationMs: 300000},
      {interval: YahooFinanceChartInterval.FIFTEEN_MINUTES, durationMs: 900000},
      {interval: YahooFinanceChartInterval.THIRTY_MINUTES, durationMs: 1800000},
      {interval: YahooFinanceChartInterval.SIXTY_MINUTES, durationMs: 3600000},
      {interval: YahooFinanceChartInterval.NINETY_MINUTES, durationMs: 5400000},
      {interval: YahooFinanceChartInterval.ONE_HOUR, durationMs: 3600000},
      {interval: YahooFinanceChartInterval.ONE_DAY, durationMs: 86400000},
      {interval: YahooFinanceChartInterval.FIVE_DAYS, durationMs: 432000000},
      {interval: YahooFinanceChartInterval.ONE_WEEK, durationMs: 604800000},
      {interval: YahooFinanceChartInterval.ONE_MONTH, durationMs: 2592000000},
      {interval: YahooFinanceChartInterval.THREE_MONTHS, durationMs: 7776000000},
    ];

    // if the range is >= 60 days, do not use minute intervals (they are not allowed by Yahoo)
    if (diff.as('days') >= 60) {
      intervalOptions.splice(0, 7);
    }

    const candidates = intervalOptions.map(option => ({
      ...option,
      count: timeDiffMs / option.durationMs,
    }));

    // Find the best interval for the given range
    return candidates
      .filter(c => c.count <= 2000)
      .sort((a, b) => a.count - b.count)
      .pop()?.interval ?? YahooFinanceChartInterval.ONE_DAY;
  }
}
