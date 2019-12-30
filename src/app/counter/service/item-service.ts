import { Injectable } from '@angular/core';
import { Item } from '../model/Item';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor() { }

    saveItems(items) {
        localStorage.removeItem('items');
        localStorage.setItem('items', items.join('|^%'));
    }

    loadItems() {
        const items = [];
        const itemStorage = localStorage.getItem('items');
        if (itemStorage) {
            const itemStorageSplit = itemStorage.split('|^%');
            for (const itemStr of itemStorageSplit) {
                const itemStrAttrs = itemStr.split(';');
                const item = new Item(itemStrAttrs[0], itemStrAttrs[1], +itemStrAttrs[2]);
                items.push(item);
            }
        }
        return items;
    }

}