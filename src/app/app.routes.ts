import { Routes } from '@angular/router';
import { SecuritiesComponent } from './component/securities/securities.component';

export const routes: Routes = [
  {
    path: 'securities',
    component: SecuritiesComponent
  },
  {
    path: '',
    children: []
  }
];
