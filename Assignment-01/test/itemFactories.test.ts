import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ItemFactory } from "../src/factories/itemFactories.js";
import { Item } from "../src/model/item.js";
import * as inputModule from "../src/utils/input.js";
import * as validation from "../src/utils/inputValidation.js";
import * as taxFactory from "../src/factories/taxStrategyFactory.js";

describe("ItemFactory.createItem", () => {
  let getUserInputMock: any;
  let validatePriceMock: any;
  let validateQuantityMock: any;
  let validateItemTypeMock: any;
  let getStrategyMock: any;
  let strategyMock: any;
  let consoleLogSpy: any;

  beforeEach(() => {
    // Mock all the dependencies
    getUserInputMock = vi.spyOn(inputModule, "getUserInput");
    validatePriceMock = vi.spyOn(validation, "validatePrice");
    validateQuantityMock = vi.spyOn(validation, "validateQuantity");
    validateItemTypeMock = vi.spyOn(validation, "validateItemType");
    getStrategyMock = vi.spyOn(taxFactory.TaxStrategyFactory, "getStrategy");

    // mock for strategy
    strategyMock = {
      calculateTax: vi.fn(),
    };

    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null for invalid price", async () => {
    getUserInputMock.mockResolvedValueOnce("Pen").mockResolvedValueOnce("abc");
    validatePriceMock.mockReturnValue(null);

    const item = await ItemFactory.createItem();
    expect(item).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Invalid price entered. Please enter a valid number."
    );
  });

  it("should return null for invalid quantity", async () => {
    getUserInputMock
      .mockResolvedValueOnce("Pen") // name
      .mockResolvedValueOnce("100") // price
      .mockResolvedValueOnce("0"); // quantity

    validatePriceMock.mockReturnValue(100);
    validateQuantityMock.mockReturnValue(null);

    const item = await ItemFactory.createItem();
    expect(item).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Invalid quantity entered. Please enter a valid number greater than 0."
    );
  });

  it("should return null for invalid item type", async () => {
    getUserInputMock
      .mockResolvedValueOnce("Pen") // name
      .mockResolvedValueOnce("100") // price
      .mockResolvedValueOnce("2") // quantity
      .mockResolvedValueOnce("unknown"); // item type

    validatePriceMock.mockReturnValue(100);
    validateQuantityMock.mockReturnValue(2);
    validateItemTypeMock.mockReturnValue(null);

    const item = await ItemFactory.createItem();
    expect(item).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalledWith("Please enter valid type.");
  });

  it("should return null if tax strategy fails", async () => {
    getUserInputMock
      .mockResolvedValueOnce("Pen")
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("1")
      .mockResolvedValueOnce("raw");

    validatePriceMock.mockReturnValue(100);
    validateQuantityMock.mockReturnValue(1);
    validateItemTypeMock.mockReturnValue("raw");

    getStrategyMock.mockImplementation(() => {
      throw new Error("Unknown type");
    });

    const item = await ItemFactory.createItem();
    expect(item).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalledWith("Unknown type");
  });

  it("should return a complete Item object when all inputs are valid", async () => {
    getUserInputMock
      .mockResolvedValueOnce("Pen") // name
      .mockResolvedValueOnce("100") // price
      .mockResolvedValueOnce("1") // quantity
      .mockResolvedValueOnce("raw"); // item type

    validatePriceMock.mockReturnValue(100);
    validateQuantityMock.mockReturnValue(1);
    validateItemTypeMock.mockReturnValue("raw");

    strategyMock.calculateTax.mockReturnValue(12.5);
    getStrategyMock.mockReturnValue(strategyMock);

    const item = await ItemFactory.createItem();

    expect(item).toBeInstanceOf(Item);
    expect(item?.getItemName()).toBe("Pen");
    expect(item?.getItemPrice()).toBe(100);
    expect(item?.getItemType()).toBe("raw");
    expect(item?.getTax()).toBe(12.5);
    expect(item?.getTotalPrice()).toBe(112.5);
  });
});
