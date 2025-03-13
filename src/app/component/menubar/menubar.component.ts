import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ThemeService } from '../../service/theme.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-menubar',
  imports: [
    Menubar,
    FormsModule,
    Button,
    AsyncPipe,
    PrimeTemplate,
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenubarComponent implements OnInit {

  protected items: MenuItem[] | undefined;
  protected readonly themeService = inject(ThemeService);

  ngOnInit() {
    this.items = [
      {
        label: 'Fanalyzer',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/'],
      },
      {
        label: 'Securities',
        routerLink: ['/securities'],
      },
      {
        label: 'Accounts',
        items: [
          {
            label: 'Deposits',
            icon: 'pi pi-warehouse',
          },
          {
            label: 'Securities',
            icon: 'pi pi-money-bill',
          },
          {
            label: 'Investment Plans',
            icon: 'pi pi-chart-bar',
          },
          {
            label: 'All transactions',
            icon: 'pi pi-list',
          },
        ]
      },
      {
        label: 'Reports',
        items: [
          {
            label: 'Statement of Assets',
            items: [
              {
                label: 'Chart',
                icon: 'pi pi-chart-line',
              },
              {
                label: 'Holdings',
                icon: 'pi pi-dollar',
              }
            ]
          },
          {
            label: 'Performance',
            items: [
              {
                label: 'Calculation',
                icon: 'pi pi-calculator',
              },
              {
                label: 'Chart',
                icon: 'pi pi-chart-bar',
              },
              {
                label: 'Return / Volatility',
                icon: 'pi pi-chart-line',
              },
              {
                label: 'Securities',
                icon: 'pi pi-money-bill',
              },
              {
                label: 'Payments',
                icon: 'pi pi-dollar',
              },
              {
                label: 'Trades',
                icon: 'pi pi-list',
              }
            ]
          },
        ]
      }
    ]
  }
}
