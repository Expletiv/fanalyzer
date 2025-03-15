import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ResourceRef,
  Signal
} from '@angular/core';
import { PpClientService } from '../../../../service/pp-client.service';
import { Security } from '../../../../types/portfolio-performance';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { RouterLink } from '@angular/router';
import { YahooFinanceService } from '../../../../service/yahoo-finance.service';
import { forkJoin, map, Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { XmlMissingMessageComponent } from '../../../util/xml-missing-message/xml-missing-message.component';

@Component({
  selector: 'app-securities',
  imports: [
    TableModule,
    Message,
    IconField,
    InputIcon,
    InputText,
    Button,
    Skeleton,
    RouterLink,
    CurrencyPipe,
    PercentPipe,
    Tag,
    XmlMissingMessageComponent,
  ],
  templateUrl: './securities.component.html',
  styleUrl: './securities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesComponent {
  private readonly ppClientService = inject(PpClientService);
  private readonly yahooFinanceService = inject(YahooFinanceService);

  protected _securities: Signal<Security[] | undefined> = this.ppClientService.getData('securities');
  protected isHydrating: Signal<boolean> = this.ppClientService.isHydrating();
  protected hydrationRequest: ResourceRef<(Security & {
    price?: number,
    marketChange?: number,
    priceCurrency?: string
  })[] | undefined> = rxResource({
    request: () => ({
      securities: this._securities() ?? [],
    }),
    loader: ({request}) => {
      const observables = request.securities.map(s => {
        if (s.tickerSymbol === undefined) {
          return of(s);
        }

        return this.getPrice(s.tickerSymbol).pipe(map(price => ({...s, ...price})));
      });

      return forkJoin(observables);
    },
  })

  protected securities: Signal<Security[]> = computed(() => this.hydrationRequest.value() ?? this._securities() ?? []);

  protected getPrice(symbol: string): Observable<{ price?: number, marketChange?: number, priceCurrency?: string }> {
    return this.yahooFinanceService
      .call('quoteSummary', symbol, {modules: ['price']}, {validateResult: true})
      .pipe(map(result => ({
        price: result.price?.regularMarketPrice,
        marketChange: result.price?.regularMarketChangePercent,
        priceCurrency: result.price?.currency
      })));
  }
}
