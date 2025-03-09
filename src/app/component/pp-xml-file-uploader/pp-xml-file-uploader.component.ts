import { Component, inject, PLATFORM_ID, Signal } from '@angular/core';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { parseString } from 'xml2js';
import { parseClient } from '../../parser/portfolio-parser';
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors';
import { Button } from 'primeng/button';
import { Client } from '../../types/portfolio-performance';
import { isPlatformServer } from '@angular/common';
import { Popover } from 'primeng/popover';
import { Card } from 'primeng/card';
import { PpClientService } from '../../service/pp-client.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pp-xml-file-uploader',
  imports: [
    FileUpload,
    Button,
    Popover,
    Card,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './pp-xml-file-uploader.component.html',
  styleUrl: './pp-xml-file-uploader.component.css'
})
export class PpXmlFileUploaderComponent {

  protected readonly isPlatformServer = isPlatformServer;
  protected platformId = inject(PLATFORM_ID);
  private ppClientService = inject(PpClientService);
  private messageService = inject(MessageService);

  protected client: Signal<Client | undefined> = toSignal(this.ppClientService.client$);

  onFileSelected(event: FileSelectEvent) {
    const file = event.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const xmlContent = reader.result as string;

        parseString(xmlContent, {
          explicitArray: false,
          valueProcessors: [parseNumbers, parseBooleans],
          attrValueProcessors: [parseBooleans, parseNumbers],
          mergeAttrs: true,
        }, (err, result) => {
          if (err) {
            console.error('Error parsing XML', err);
            this.messageService.add({summary: 'Error parsing XML', severity: 'error'});
            return;
          }

          try {
            this.ppClientService.setClient(parseClient(result.client));
          } catch (e) {
            console.error('Error parsing input', e);
          }

          this.messageService.add({summary: 'File uploaded', severity: 'success'});
        });
      };

      reader.readAsText(file);
    }
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
