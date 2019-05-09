import {Component, OnInit} from '@angular/core';
import {Item} from './model/Item';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {
  items = [];
  name: String = '';
  desc: String = '';

  ngOnInit(): void {
    this.loadItems();
  }

  addItem() {
    const item = new Item();
    item.name = this.name;
    item.desc = this.desc;
    item.value = 0;

    this.items.push(item);
    this.saveItems();
  }


  loadItems() {
    this.items = [];
    const itemStorage = localStorage.getItem('items');
    if (itemStorage) {
      const itemStorageSplit = itemStorage.split(',');
      for (const itemStr of itemStorageSplit) {
        const itemStrArr = itemStr.split(';');
        const item = new Item();
        item.name = itemStrArr[0];
        item.desc = itemStrArr[1];
        item.value = +itemStrArr[2];
        this.items.push(item);
      }

    }
  }

  saveItems() {
    localStorage.removeItem('items');
    localStorage.setItem('items', this.items.join(','));
    this.loadItems();
  }

  increase(item) {
    item.value += 1;
    this.saveItems();
  }


  clearItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === item.name) {
        this.items[i].value = 0;
      }
    }
    this.saveItems();
  }

  removeItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === item.name) {
        this.items.splice(i, 1);
      }
    }
    this.saveItems();
  }

}
