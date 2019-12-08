import {FilterCategories} from "./filterCategories.enum";

/**
 * An EventServiceFilter is constructed each time only a specific part of the services stored in the database is desired
 * to be fetched and returned.
 * The filter contains 2 values, the type, which is further specified in the {@link FilterCategories} enum and the value.
 * This is built to make it as easy as possible to construct the sql query as modular as possible from the filters.
 */
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
