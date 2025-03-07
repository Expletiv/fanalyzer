import { Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ThemeService } from '../../service/theme.service';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PpXmlFileUploaderComponent } from '../pp-xml-file-uploader/pp-xml-file-uploader.component';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    Menubar,
    FormsModule,
    Button,
    AsyncPipe,
    PrimeTemplate,
    PpXmlFileUploaderComponent
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css'
})
export class MenubarComponent implements OnInit {

  protected items: MenuItem[] | undefined;
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.items = [
      {
        label: 'Fanalyzer',
        command: () => this.router.navigate(['/'])
      },
      {
        label: 'Other',
        command: () => this.router.navigate(['/other'])
      }
    ]
  }
}
