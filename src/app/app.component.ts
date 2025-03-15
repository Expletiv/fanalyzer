import { Component } from '@angular/core';
import { MenubarComponent } from './component/main/menubar/menubar.component';
import { PpXmlFileUploaderComponent } from './component/util/pp-xml-file-uploader/pp-xml-file-uploader.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MenubarComponent,
    PpXmlFileUploaderComponent,
    RouterOutlet,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fanalyzer';
}
