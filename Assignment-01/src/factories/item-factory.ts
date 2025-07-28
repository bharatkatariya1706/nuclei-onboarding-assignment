import { getUserInput } from "../utils/input.js";
import * as item from "../models/item.js";
import { ItemType } from "../models/item-type.js";
import { ItemInputData } from "../utils/input-handler.js";

// Factory map: associates ItemType with the corresponding class
const itemTypeMap: Record<
  ItemType,
  new (name: string, price: number, quantity: number, type: ItemType) => item.Item
> = {
  [ItemType.RAW]: item.RawItem,
  [ItemType.MANUFACTURED]: item.ManufacturedItem,
  [ItemType.IMPORTED]: item.ImportedItem,
};

export class ItemFactory {
  // this function creates an item based on the input data
  static createItem(data: ItemInputData): item.Item | null {
    const { itemName, itemPrice, itemQuantity, itemType } = data;

    const itemClass = itemTypeMap[itemType as ItemType];
    // create item instance based on the type
    const item = new itemClass(itemName, itemPrice, itemQuantity, itemType);

    // calculate tax for the item
    item.calculateTax();
    return item;
  }
}
