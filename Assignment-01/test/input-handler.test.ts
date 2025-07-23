import { describe, it, expect, vi, beforeEach } from "vitest";
import * as inputModule from "../src/utils/input.js";
import { getValidatedItemInput } from "../src/utils/input-handler.js";
import { ItemType } from "../src/models/item-type.js";

describe("getValidatedItemInput", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return valid item input data", async () => {
    const mockInputs = ["Pen", "100", "2", "raw"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(mockInputs.shift()!)
    );

    const result = await getValidatedItemInput();
    expect(result).toEqual({
      itemName: "Pen",
      itemPrice: 100,
      itemQuantity: 2,
      itemType: ItemType.RAW,
    });
  });

  it("should return null for invalid price", async () => {
    const mockInputs = ["Pen", "abc"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(mockInputs.shift()!)
    );

    const result = await getValidatedItemInput();
    expect(result).toBeNull();
  });

  it("should return null for invalid quantity", async () => {
    const mockInputs = ["Pen", "100", "-1"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(mockInputs.shift()!)
    );

    const result = await getValidatedItemInput();
    expect(result).toBeNull();
  });

  it("should return null for invalid item type", async () => {
    const mockInputs = ["Pen", "100", "1", "invalid"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(mockInputs.shift()!)
    );

    const result = await getValidatedItemInput();
    expect(result).toBeNull();
  });
});
