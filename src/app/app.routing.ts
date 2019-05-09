import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {TimerComponent} from './timer/dashboard/timer.component';
import {CounterComponent} from './counter/counter.component';

const routes: Routes = [
  {path: '', component: TimerComponent},
  {path: 'timer', component: TimerComponent},
  {path: 'counter', component: CounterComponent},
];

export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);
