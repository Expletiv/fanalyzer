import { Component, OnInit } from '@angular/core';
import { Fieldset } from 'primeng/fieldset';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-overview-menu',
  imports: [
    Fieldset,
    PanelMenu
  ],
  templateUrl: './overview-menu.component.html',
  styleUrl: './overview-menu.component.css'
})
export class OverviewMenuComponent implements OnInit {

  protected overviewItems: MenuItem[] | undefined;

  ngOnInit() {
    this.overviewItems = [
      {
        label: 'Accounts',
        expanded: true,
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
        expanded: true,
        items: [
          {
            label: 'Statement of Assets',
            expanded: true,
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
            expanded: true,
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
    ];
  }
}
