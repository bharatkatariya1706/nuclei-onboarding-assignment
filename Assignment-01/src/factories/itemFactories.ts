import { Item } from "../model/item.js";
import { getUserInput } from "../utils/input.js";
import {
  validateItemType,
  validatePrice,
  validateQuantity,
} from "../utils/inputValidation.js";
import { TaxStrategyFactory } from "./taxStrategyFactory.js";

//item factory that will create item object for us
export class ItemFactory {
  // function that create object by taking user inputs and do some validations on it
  static async createItem(): Promise<Item | null> {
    const item = new Item();
    const name = await getUserInput("Enter item name: ");
    item.setItemName(name);

    const priceString = await getUserInput("Enter item Price : ");
    const price = validatePrice(priceString);
    if (price === null) {
      console.log("Invalid price entered. Please enter a valid number.");
      return null;
    }
    item.setItemPrice(price);

    const quantityString = await getUserInput("Enter item quantity : ");
    const quantity = validateQuantity(quantityString);
    if (quantity === null) {
      console.log(
        "Invalid quantity entered. Please enter a valid number greater than 0."
      );
      return null;
    }
    item.setItemQuantity(quantity);

    const typeInput = await getUserInput(
      "Enter item type (raw/manufactured/imported) : "
    );
    const type = validateItemType(typeInput);
    if (type === null) {
      console.log("Please enter valid type.");
      return null;
    }

    item.setItemType(type);

    // Calculate tax and total price based on the item type
    try {
      const strategy = TaxStrategyFactory.getStrategy(type);
      const tax = strategy.calculateTax(price);
      item.setTax(tax);
      item.setTotalPrice(price + tax);
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
    // return created item object
    return item;
  }
}
