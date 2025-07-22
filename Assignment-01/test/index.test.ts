import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as inputModule from "../src/utils/input.js";
import * as itemFactoryModule from "../src/factories/itemFactories.js";
import { main, processNewItem } from "../src/index.js";
import { Item } from "../src/model/item.js";

// Create a mock item
const mockItem: Partial<Item> = {
  getItemName: () => "Pen",
  getItemPrice: () => 100,
  getItemType: () => "raw",
  getTax: () => 12.5,
  getTotalPrice: () => 112.5,
};

let consoleLogSpy: any;
let consoleTableSpy: any;
let exitSpy: any;

beforeEach(() => {
  consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  consoleTableSpy = vi.spyOn(console, "table").mockImplementation(() => {});
  exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("EXIT_CALLED");
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("processNewItem", () => {
  it("should display item details when item is created", async () => {
    vi.spyOn(itemFactoryModule.ItemFactory, "createItem").mockResolvedValue(
      mockItem as Item
    );

    await processNewItem();

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleTableSpy).toHaveBeenCalledWith({
      Name: "Pen",
      Price: 100,
      Type: "raw",
      Tax: 12.5,
      "Total Price": 112.5,
    });
  });

  it("should return early if item creation returns null", async () => {
    vi.spyOn(itemFactoryModule.ItemFactory, "createItem").mockResolvedValue(
      null
    );

    await processNewItem();

    expect(consoleTableSpy).not.toHaveBeenCalled();
  });
});

describe("Main Program Flow", () => {
  it("main should loop twice if user enters 'yes' and then 'no'", async () => {
    const getUserInputMock = vi
      .spyOn(inputModule, "getUserInput")
      .mockResolvedValueOnce("yes")
      .mockResolvedValueOnce("no");

    const itemMock = vi
      .spyOn(itemFactoryModule.ItemFactory, "createItem")
      .mockResolvedValue(mockItem as Item);

    try {
      await main();
    } catch (e) {
      expect((e as Error).message).toBe("EXIT_CALLED");
    }

    expect(itemMock).toHaveBeenCalledTimes(2);
    expect(getUserInputMock).toHaveBeenCalledTimes(2);
  });

  it("main should exit immediately if user enters 'no' first", async () => {
    const getUserInputMock = vi
      .spyOn(inputModule, "getUserInput")
      .mockResolvedValueOnce("no");

    const itemMock = vi
      .spyOn(itemFactoryModule.ItemFactory, "createItem")
      .mockResolvedValue(mockItem as Item);

    try {
      await main();
    } catch (e) {
      expect((e as Error).message).toBe("EXIT_CALLED");
    }

    expect(itemMock).toHaveBeenCalledTimes(1);
    expect(getUserInputMock).toHaveBeenCalledTimes(1);
  });
});
