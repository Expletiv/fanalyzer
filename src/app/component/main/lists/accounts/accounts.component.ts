import { Component, computed, inject, Signal } from '@angular/core';
import { PpClientService } from '../../../../service/pp-client.service';
import { Account } from '../../../../types/portfolio-performance';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { Tag } from 'primeng/tag';
import { XmlMissingMessageComponent } from '../../../util/xml-missing-message/xml-missing-message.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [
    Button,
    IconField,
    InputIcon,
    InputText,
    PrimeTemplate,
    TableModule,
    RouterLink,
    Tag,
    XmlMissingMessageComponent,
    DatePipe
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {

  private readonly ppClientService = inject(PpClientService);

  protected _accounts: Signal<Account[] | undefined> = this.ppClientService.getData('accounts');
  protected accounts: Signal<(Omit<Account, 'updatedAt'> & { updatedAt: Date, transactionCount: number })[]> = computed(() => {
    return this._accounts()?.map(account => {
      return {
        ...account,
        updatedAt: new Date(account.updatedAt),
        transactionCount: account.transactions.length
      };
    }) ?? [];
  });
}
