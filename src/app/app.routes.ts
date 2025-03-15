import { Routes } from '@angular/router';
import { SecuritiesComponent } from './component/main/lists/securities/securities.component';
import { SecurityDetailComponent } from './component/main/security-detail/security-detail.component';
import { AccountsComponent } from './component/main/lists/accounts/accounts.component';

export const routes: Routes = [
  {
    path: 'accounts',
    component: AccountsComponent
  },
  {
    path: 'securities',
    component: SecuritiesComponent
  },
  {
    path: 'security/:symbol',
    component: SecurityDetailComponent
  },
  {
    path: '',
    children: []
  }
];
