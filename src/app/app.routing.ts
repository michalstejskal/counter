import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {TimerComponent} from './timer/dashboard/timer.component';

const routes: Routes = [
  {path: '', component: TimerComponent}
];

export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);
