import { describe, it, expect, vi, beforeEach } from "vitest";
import * as inputHandlerModule from "../src/utils/input-handler.js";
import * as inputModule from "../src/utils/input.js";
import { ItemFactory } from "../src/factories/item-factory.js";
import { processNewItem, main } from "../src/index.js"; // Update with actual file path
import { Item } from "../src/models/item.js";
import { ItemInputData } from "../src/utils/input-handler.js";
import { ItemType } from "../src/models/item-type.js";

describe("processNewItem", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create an item and log its summary", async () => {
    const mockInputData: ItemInputData = {
      itemName: "Book",
      itemPrice: 100,
      itemQuantity: 2,
      itemType: ItemType.RAW,
    };

    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockResolvedValue(
      mockInputData
    );

    const mockItem = {
      getSummary: () => ({
        Name: "Book",
        Price: 100,
        Quantity: 2,
        Category: "raw",
      }),
    } as unknown as Item;

    vi.spyOn(ItemFactory, "createItem").mockResolvedValue(mockItem);
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});

    await processNewItem();

    expect(console.table).toHaveBeenCalledWith(mockItem.getSummary());
    expect(console.log).toHaveBeenCalled();
  });

  it("should return early if input is null", async () => {
    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockResolvedValue(
      null
    );
    const createSpy = vi.spyOn(ItemFactory, "createItem");

    await processNewItem();

    expect(createSpy).not.toHaveBeenCalled();
  });

  it("should return early if item creation fails", async () => {
    const mockInputData: ItemInputData = {
      itemName: "Pen",
      itemPrice: 10,
      itemQuantity: 1,
      itemType: ItemType.RAW,
    };

    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockResolvedValue(
      mockInputData
    );
    vi.spyOn(ItemFactory, "createItem").mockResolvedValue(null);
    const tableSpy = vi.spyOn(console, "table");

    await processNewItem();

    expect(tableSpy).not.toHaveBeenCalled();
  });
});

describe("main", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should run the loop once and exit on 'no'", async () => {
    const mockInputData: ItemInputData = {
      itemName: "Notebook",
      itemPrice: 50,
      itemQuantity: 5,
      itemType: ItemType.RAW,
    };

    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockResolvedValue(
      mockInputData
    );

    const mockItem = {
      getSummary: () => ({
        Name: "Notebook",
        Price: 50,
        Quantity: 5,
        Category: "raw",
      }),
    } as unknown as Item;

    vi.spyOn(ItemFactory, "createItem").mockResolvedValue(mockItem);
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});

    vi.spyOn(inputModule, "getUserInput").mockResolvedValue("no");

    await main();
  });

  it("should run multiple times if user says yes", async () => {
    const mockInputData: ItemInputData = {
      itemName: "Pen",
      itemPrice: 10,
      itemQuantity: 2,
      itemType: ItemType.RAW,
    };

    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockResolvedValue(
      mockInputData
    );

    const mockItem = {
      getSummary: () => ({
        Name: "Pen",
        Price: 10,
        Quantity: 2,
        Category: "raw",
      }),
    } as unknown as Item;

    vi.spyOn(ItemFactory, "createItem").mockResolvedValue(mockItem);
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});

    const responses = ["yes", "no"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(responses.shift()!)
    );

    await main();
  });

  it("should handle mixed case 'YeS' input", async () => {
    const mockInputData: ItemInputData = {
      itemName: "Marker",
      itemPrice: 20,
      itemQuantity: 3,
      itemType: ItemType.RAW,
    };

    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockResolvedValue(
      mockInputData
    );

    const mockItem = {
      getSummary: () => ({
        Name: "Marker",
        Price: 20,
        Quantity: 3,
        Category: "raw",
      }),
    } as unknown as Item;

    vi.spyOn(ItemFactory, "createItem").mockResolvedValue(mockItem);
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});

    const responses = ["YeS", "No"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(responses.shift()!)
    );

    await main();
  });

  it("should catch and log error in main()", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(inputHandlerModule, "getValidatedItemInput").mockRejectedValue(
      new Error("Test error")
    );
    vi.spyOn(inputModule, "getUserInput").mockResolvedValue("no");

    await main();

    expect(errorSpy).toHaveBeenCalled();
  });
});
