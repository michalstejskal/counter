export class Item {
  name: string;
  description: string;
  value: number;

  constructor(name: string, description: string, value: number) {
    this.name = name;
    this.description = description;
    this.value = value;
  }

  toString() {
    return this.name + ';' + this.description + ';' + this.value;
  }
}
