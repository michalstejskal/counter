import { Component, OnInit } from '@angular/core';
import { Item } from '../model/Item';
import { ItemService } from '../service/item-service';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items = [];
  itemService: ItemService;

  constructor(itemService: ItemService) {
    this.itemService = itemService;
  }

  ngOnInit(): void {
    this.items = this.itemService.loadItems();
  }

  increase(item) {
    item.value += 1;
    this.itemService.saveItems(this.items);
  }

  clearItem(item) {
    const index = this.items.indexOf(item, 0);
    this.items[index].value = -1;
    this.itemService.saveItems(this.items);
  }

  removeItem(item) {
    const index = this.items.indexOf(item, 0);
    this.items.splice(index, 1);
    this.itemService.saveItems(this.items);
  }

}
