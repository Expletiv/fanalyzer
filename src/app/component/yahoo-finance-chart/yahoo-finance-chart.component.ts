import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  Signal,
} from '@angular/core';
import { UIChart } from 'primeng/chart';
import { YahooFinanceService } from '../../service/yahoo-finance.service';
import { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import { ProgressBar } from 'primeng/progressbar';
import { Card } from 'primeng/card';
import { Tab, TabList, Tabs } from 'primeng/tabs';
import { Skeleton } from 'primeng/skeleton';
import { YahooFinanceChartInterval, YahooFinanceChartRange } from '../../types/yahoo-finance';
import { match } from 'ts-pattern';
import { rxResource } from '@angular/core/rxjs-interop';

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
    Skeleton,
  ],
  templateUrl: './yahoo-finance-chart.component.html',
  styleUrl: './yahoo-finance-chart.component.css'
})
export class YahooFinanceChartComponent {
  private yahooFinance = inject(YahooFinanceService);
  protected supportedRanges = Object.values(YahooFinanceChartRange);

  symbol = input.required<string>();

  /**
   * A date string. Set `range` to `YahooFinanceChartRange.CUSTOM` to use this.
   */
  from = model<string>(DateTime.now().toISODate());
  private _from = computed<string>(() => {
    const range = this.range();
    return range === YahooFinanceChartRange.CUSTOM ? this.from() : this.computeFrom(range);
  })

  /**
   * A date string. Set `range` to `YahooFinanceChartRange.CUSTOM` to use this.
   */
  to = model<string>();
  private _to = computed<string | undefined>(() => {
    return this.range() === YahooFinanceChartRange.CUSTOM ? this.to() : undefined;
  })

  /**
   * The interval between data points. If not defined, a suitable interval will be chosen.
   */
  interval = input<YahooFinanceChartInterval>();
  private _interval = computed(() => this.interval() ?? this.computeInterval(this._from(), this._to()));

  /**
   * The range of the data to show. Defaults to `YahooFinanceChartRange.DAY`.
   */
  range = model<YahooFinanceChartRange>(YahooFinanceChartRange.ONE_DAY);

  chartData = rxResource({
    request: () => ({
      symbol: this.symbol(),
      from: this._from(),
      to: this._to(),
      interval: this._interval(),
    }),
    loader: ({request}) => {
      return this.yahooFinance.call('chart', request.symbol, {
        period1: request.from,
        period2: request.to,
        interval: request.interval,
        return: 'array'
      }, {validateResult: true});
    }
  })

  protected rangeOptions: Signal<YahooFinanceChartRange[]> = computed<YahooFinanceChartRange[]>(() => {
    return this.chartData.value()?.meta.validRanges.filter((range) => {
      return this.supportedRanges.includes(range as YahooFinanceChartRange);
    }) as YahooFinanceChartRange[] ?? [];
  });

  protected data = computed<ChartData<'line', { x: number, y: number | null }[]>>(
    () => ({
      datasets: [{
        label: this.symbol(),
        data: this.chartData.value()?.quotes.map(
          (quote) => ({
            // chartjs uses milliseconds since epoch internally
            x: new Date(quote.date).getTime(),
            y: quote.close
          })) ?? [],
        fill: true,
        borderColor: '#4bc0c0',
        borderWidth: 1.5,
        pointRadius: 0,
        indexAxis: 'x',
        tension: 0,
      }]
    }));

  protected options = computed<ChartOptions>(() => {
    return {
      responsive: true,
      // use the internal representation of the data (needed for data decimation)
      parsing: false,
      scales: {
        x: {
          // timeseries instead of time, so that the data is not interpolated (e.g. for weekends)
          type: 'timeseries',
          time: {
            tooltipFormat: 'yyyy-MM-dd HH:mm',
            displayFormats: {
              hour: 'HH:mm',
            },
          },
          ticks: {
            autoSkipPadding: 50,
            maxRotation: 0,
          }
        },
        y: {
          title: {
            display: true,
            text: `Price (${this.chartData.value()?.meta.currency})`
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
    }
  });

  constructor() {
    // Sync after range changes
    effect(() => this.from.set(this._from()))
    effect(() => this.to.set(this._to()))
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
