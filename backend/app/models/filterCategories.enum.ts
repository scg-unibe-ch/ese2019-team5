/**
 * This enum contains all the possible filters for the EventServices. It is built in a way that the
 * values correspond exactly with the column names of the table service in the database. This way it can
 * be used to build the query and doesn't need further conversion.
 */
export enum FilterCategories {
  user = "userid",
  category = "category",
  subtype = "subtype",
  textSearch = "search",
  capacity = "capacity",
  price = "price",
  city = "city",
  availability = "availability",
  serviceId = "id",

}
