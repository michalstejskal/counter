import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ItemListComponent } from './counter/item-list/item-list.component';
import { ItemAddComponent } from './counter/item-add/item-add.component';

const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'add', component: ItemAddComponent },
];

export const routingModule: ModuleWithProviders<unknown> = RouterModule.forRoot(routes);
