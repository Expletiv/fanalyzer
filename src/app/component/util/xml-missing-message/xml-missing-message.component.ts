import { Component, inject, Signal } from '@angular/core';
import { PpClientService } from '../../../service/pp-client.service';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-xml-missing-message',
  imports: [
    Message
  ],
  templateUrl: './xml-missing-message.component.html',
  styleUrl: './xml-missing-message.component.css'
})
export class XmlMissingMessageComponent {
  private readonly ppClientService = inject(PpClientService);

  protected isXmlUploaded: Signal<boolean> = this.ppClientService.isXmlUploaded();
}
