import { Component, inject, model, ModelSignal, OnInit, PLATFORM_ID } from '@angular/core';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { parseString } from 'xml2js';
import { parseClient } from '../../parser/portfolio-parser';
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors';
import { Button } from 'primeng/button';
import { Client } from '../../types/portfolio-performance';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Popover } from 'primeng/popover';

const CLIENT_KEY = 'client';

@Component({
  selector: 'app-pp-xml-file-uploader',
  standalone: true,
  imports: [
    FileUpload,
    Button,
    Popover
  ],
  templateUrl: './pp-xml-file-uploader.component.html',
  styleUrl: './pp-xml-file-uploader.component.css'
})
export class PpXmlFileUploaderComponent implements OnInit {

  protected readonly isPlatformServer = isPlatformServer;

  protected platformId = inject(PLATFORM_ID);

  protected client: ModelSignal<Client | undefined> = model<Client>();

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const client = localStorage.getItem(CLIENT_KEY);
      if (client) {
        this.client.set(JSON.parse(client));
      }
    }
  }

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

            return;
          }

          const client = parseClient(result.client);
          this.client.set(client);
          localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
        });
      };

      reader.readAsText(file);
    }
  }

  onDownload() {
    const client = localStorage.getItem(CLIENT_KEY);
    if (!client) {
      return;
    }
    const blob = new Blob([client], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.portfolio.json';
    a.click();
  }
}
