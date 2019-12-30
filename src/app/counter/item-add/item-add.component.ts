import { Component, OnInit } from '@angular/core';
import { Item } from '../model/Item';
import { Router } from '@angular/router';
import { ItemService } from '../service/item-service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent {
  name = '';
  description = '';

  router: Router;
  itemService: ItemService;

  constructor(router: Router, itemService: ItemService) {
    this.router = router;
    this.itemService = itemService;
  }

  addItem() {
    const items = this.itemService.loadItems();

    items.push(new Item(this.name, this.description, 0));
    this.itemService.saveItems(items);
    this.router.navigate(['/']);
  }
}
