import { Component, inject, Signal } from '@angular/core';
import { PpClientService } from '../../service/pp-client.service';
import { Client } from '../../types/portfolio-performance';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-securities',
  imports: [
    TableModule,
    Message,
    IconField,
    InputIcon,
    InputText,
    Button
  ],
  templateUrl: './securities.component.html',
  styleUrl: './securities.component.css'
})
export class SecuritiesComponent {
  private readonly ppClientService = inject(PpClientService);

  protected client: Signal<Client | undefined> = toSignal(this.ppClientService.client$);
  protected isXmlUploaded: Signal<boolean> = toSignal(this.ppClientService.isXmlUploaded$, {initialValue: false});
}
