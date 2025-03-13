import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Button } from 'primeng/button';
import { ClientData } from '../../types/portfolio-performance';
import { Popover } from 'primeng/popover';
import { Card } from 'primeng/card';
import { PpClientService } from '../../service/pp-client.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-pp-xml-file-uploader',
  imports: [
    Button,
    Popover,
    Card,
    Toast,
    ProgressBar
  ],
  providers: [MessageService],
  templateUrl: './pp-xml-file-uploader.component.html',
  styleUrl: './pp-xml-file-uploader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PpXmlFileUploaderComponent {

  private ppClientService = inject(PpClientService);
  private messageService = inject(MessageService);

  protected client: Signal<ClientData | undefined> = this.ppClientService.getData();
  protected isHydrating: Signal<boolean> = this.ppClientService.isHydrating();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const maxSize = 40 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.add({summary: 'File size exceeds the maximum limit of 40 MB', severity: 'error'});

        return;
      }

      this.parseFile(file);
    }
  }

  parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const xmlContent = reader.result as string;

      const parser = new XMLParser({
        ignoreAttributes: false,
        parseTagValue: true,
        parseAttributeValue: true,
        attributeNamePrefix: '',
      })

      try {
        const result = parser.parse(xmlContent);

        try {
          this.ppClientService.newClient(result.client);
        } catch (e) {
          console.error('Error parsing input', e);
        }

        this.messageService.add({summary: 'File uploaded', severity: 'success'});
      } catch (e) {
        if (e) {
          console.error('Error parsing XML', e);
          this.messageService.add({summary: 'Error parsing XML', severity: 'error'});
          return;
        }
      }
    };
    reader.readAsText(file);
  }

  onDownload() {
    const client = this.client();
    if (!client) {
      return;
    }
    const blob = new Blob([JSON.stringify(client)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.portfolio.json';
    a.click();

    this.messageService.add({summary: 'Download started'});
  }
}
