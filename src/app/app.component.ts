import { Component } from '@angular/core';
import { MenubarComponent } from './component/menubar/menubar.component';
import { PpXmlFileUploaderComponent } from './component/pp-xml-file-uploader/pp-xml-file-uploader.component';
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
