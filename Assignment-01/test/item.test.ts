// Import the Item class (adjust the path based on your folder structure)
import { describe, it, expect } from "vitest"; // Or use from 'jest' if using Jest
import { Item } from "./../src/model/item.js"; 

describe("Item Class", () => {
  it("should set and get item name correctly", () => {
    const item = new Item();
    item.setItemName("Laptop");
    expect(item.getItemName()).toBe("Laptop");
  });

  it("should set and get item price correctly", () => {
    const item = new Item();
    item.setItemPrice(500);
    expect(item.getItemPrice()).toBe(500);
  });

  it("should set and get item quantity correctly", () => {
    const item = new Item();
    item.setItemQuantity(3);
    expect(item.getItemQuantity()).toBe(3);
  });

  it("should set and get item type correctly", () => {
    const item = new Item();
    item.setItemType("raw");
    expect(item.getItemType()).toBe("raw");
  });

  it("should set and get tax correctly", () => {
    const item = new Item();
    item.setTax(50);
    expect(item.getTax()).toBe(50);
  });

  it("should set and get total price correctly", () => {
    const item = new Item();
    item.setTotalPrice(550);
    expect(item.getTotalPrice()).toBe(550);
  });
});
