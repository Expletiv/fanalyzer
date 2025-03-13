import { Routes } from '@angular/router';
import { SecuritiesComponent } from './component/securities/securities.component';
import { SecurityDetailComponent } from './component/security-detail/security-detail.component';

export const routes: Routes = [
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
