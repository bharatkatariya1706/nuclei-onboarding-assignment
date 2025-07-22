import { ItemType } from "../model/itemType.js";

// this funciton validates the price input from the user
export function validatePrice(price: string): number | null {
  const priceValue = parseFloat(price);
  if (!isNaN(priceValue) && priceValue >= 0) {
    return priceValue;
  }
  return null;
}

// this function validates the quantity input from the user
export function validateQuantity(quantity: string): number | null {
  const quantityValue = parseInt(quantity);
  if (!isNaN(quantityValue) && quantityValue > 0) {
    return quantityValue;
  }
  return null;
}

const ItemTypeMap: Record<string, ItemType> = {};

for (let value of Object.values(ItemType)) {
  if (typeof value === "string") {
    ItemTypeMap[value.toLowerCase()] = value;
  }
}

// this function validates the item type input from the user
export function validateItemType(type: string): ItemType | null {
  const lowerType = type.trim().toLowerCase();
  if (lowerType in ItemTypeMap) {
    return ItemTypeMap[lowerType];
  }
  return null;
}
