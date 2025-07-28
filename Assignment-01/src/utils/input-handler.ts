import { getUserInput } from "./input.js";
import * as validations from "./input-validation.js";
import { ItemType } from "../models/item-type.js";

// Interface for item input data
export interface ItemInputData {
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemType: ItemType;
}

// this function gets user input for item details and validates them
// if any input is invalid, it returns null
export async function getValidatedItemInput(): Promise<ItemInputData | null> {
  const itemName = await getUserInput("Enter item name: ");

  const priceStr = await getUserInput("Enter item price: ");
  const itemPrice = validations.validatePrice(priceStr);
  if (itemPrice === null) {
    console.log("Invalid price entered.");
    return null;
  }

  const quantityStr = await getUserInput("Enter item quantity: ");
  const itemQuantity = validations.validateQuantity(quantityStr);
  if (itemQuantity === null) {
    console.log("Invalid quantity entered.");
    return null;
  }

  const typeStr = await getUserInput(
    "Enter item type (raw/manufactured/imported): "
  );
  const itemType = validations.validateItemType(typeStr);
  if (!itemType) {
    console.log("Invalid item type entered.");
    return null;
  }

  return { itemName, itemPrice, itemQuantity, itemType };
}
