import {FilterCategories} from "./filterCategories.enum";

export class EventServiceFilter {
  private type: FilterCategories;
  private value: string | number;

  constructor (type: FilterCategories, value: string | number) {
    this.type = type;
    this.value = value;
  }

  public getType() : FilterCategories {
    return this.type;
  }

  public getValue() : string | number {
    return this.value;
  }
}
