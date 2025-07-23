import { describe, it, expect, vi } from "vitest";
import { ItemFactory } from "../src/factories/item-factory.js";
import { ItemType } from "../src/models/item-type.js";
import { RawItem, ManufacturedItem, ImportedItem } from "../src/models/item.js";
import { ItemInputData } from "../src/utils/input-handler.js";

describe("ItemFactory.createItem", () => {
  it("should create and return a RawItem with correct tax", async () => {
    const input: ItemInputData = {
      itemName: "Pen",
      itemPrice: 100,
      itemQuantity: 2,
      itemType: ItemType.RAW,
    };

    const item = await ItemFactory.createItem(input);

    expect(item).toBeInstanceOf(RawItem);
    expect(item?.getSummary().tax).toBeCloseTo(12.5);
    expect(item?.getSummary().totalPrice).toBeCloseTo(112.5);
  });

  it("should create and return a ManufacturedItem with correct tax", async () => {
    const input: ItemInputData = {
      itemName: "Toy",
      itemPrice: 100,
      itemQuantity: 1,
      itemType: ItemType.MANUFACTURED,
    };

    const item = await ItemFactory.createItem(input);

    const summary = item?.getSummary();
    expect(item).toBeInstanceOf(ManufacturedItem);
    expect(summary?.tax).toBeCloseTo(14.75);
    expect(summary?.totalPrice).toBeCloseTo(114.75);
  });

  it("should create and return an ImportedItem with correct tax (<=100 case)", async () => {
    const input: ItemInputData = {
      itemName: "Book",
      itemPrice: 90,
      itemQuantity: 1,
      itemType: ItemType.IMPORTED,
    };

    const item = await ItemFactory.createItem(input);

    const summary = item?.getSummary();
    expect(item).toBeInstanceOf(ImportedItem);
    expect(summary?.tax).toBeCloseTo(14); // 90 * 0.1 = 9 + surcharge 5
    expect(summary?.totalPrice).toBeCloseTo(104);
  });

  it("should create and return an ImportedItem with correct tax (>200 case)", async () => {
    const input: ItemInputData = {
      itemName: "Laptop",
      itemPrice: 300,
      itemQuantity: 1,
      itemType: ItemType.IMPORTED,
    };

    const item = await ItemFactory.createItem(input);

    const summary = item?.getSummary();
    expect(item).toBeInstanceOf(ImportedItem);
    expect(summary?.tax).toBeCloseTo(46.5); // 300 * 0.1 = 30 + 0.05 * (300+30) = 16.5
    expect(summary?.totalPrice).toBeCloseTo(346.5);
  });
});
