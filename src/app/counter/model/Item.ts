export class Item {
  name: String;
  desc: String;
  value: number;

  toString() {
    return this.name + ';' + this.desc + ';' + this.value;
  }
}
