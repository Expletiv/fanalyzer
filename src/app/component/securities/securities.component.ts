import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { PpClientService } from '../../service/pp-client.service';
import { ClientData } from '../../types/portfolio-performance';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

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
  ],
  templateUrl: './securities.component.html',
  styleUrl: './securities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesComponent {
  private readonly ppClientService = inject(PpClientService);

  protected client: Signal<ClientData | undefined> = this.ppClientService.getData();
  protected isHydrating: Signal<boolean> = this.ppClientService.isHydrating();
  protected isXmlUploaded: Signal<boolean> = this.ppClientService.isXmlUploaded();
}
