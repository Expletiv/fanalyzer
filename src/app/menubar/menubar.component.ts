import { Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-menubar',
  imports: [
    Menubar,
    FormsModule,
    Button
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css'
})
export class MenubarComponent implements OnInit {

  protected items: MenuItem[] | undefined;

  protected themeService = inject(ThemeService);

  ngOnInit() {
    this.items = [
      {
        label: 'Overview',
      }
    ]
  }
}
