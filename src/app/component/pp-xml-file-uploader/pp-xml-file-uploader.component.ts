import { Component } from '@angular/core';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { parseString } from 'xml2js';
import { parseAccounts } from '../../parser/portfolio-parser';
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors';

@Component({
  selector: 'app-pp-xml-file-uploader',
  standalone: true,
  imports: [
    FileUpload
  ],
  templateUrl: './pp-xml-file-uploader.component.html',
  styleUrl: './pp-xml-file-uploader.component.css'
})
export class PpXmlFileUploaderComponent {
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

          const accs = result.client.accounts;

          localStorage.setItem('accountsUnparsed', JSON.stringify(accs));
          localStorage.setItem('accounts', JSON.stringify(parseAccounts(accs)));
        });
      };
      reader.readAsText(file);
    }
  }
}
