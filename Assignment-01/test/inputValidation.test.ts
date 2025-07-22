import { describe, it, vi, expect } from "vitest";
import { validateItemType, validatePrice, validateQuantity } from "../src/utils/inputValidation";
import { ItemType } from "../src/model/itemType";


vi.mock("../model/itemType.js", () => ({
  ItemType,
}));

describe("validatePrice", () => {
  it("should return number when valid price is passed", () => {
    expect(validatePrice("100")).toBe(100);
    expect(validatePrice("99.99")).toBe(99.99);
    expect(validatePrice("0")).toBe(0);
  });

  it("should return null for invalid or negative price", () => {
    expect(validatePrice("abc")).toBeNull();
    expect(validatePrice("-5")).toBeNull();
    expect(validatePrice("")).toBeNull();
  });
});

describe("validateQuantity", () => {
  it("should return number when valid quantity is passed", () => {
    expect(validateQuantity("5")).toBe(5);
    expect(validateQuantity("1")).toBe(1);
  });

  it("should return null for invalid or zero/negative quantity", () => {
    expect(validateQuantity("0")).toBeNull();
    expect(validateQuantity("-3")).toBeNull();
    expect(validateQuantity("abc")).toBeNull();
    expect(validateQuantity("")).toBeNull();
  });
});

describe("validateItemType", () => {
  it("should return correct ItemType for valid input (case insensitive)", () => {
    expect(validateItemType("raw")).toBe(ItemType.RAW);
    expect(validateItemType("RAW")).toBe(ItemType.RAW);
    expect(validateItemType("  manufactured ")).toBe(ItemType.MANUFACTURED);
    expect(validateItemType("ImPoRtEd")).toBe(ItemType.IMPORTED);
  });

  it("should return null for invalid item type", () => {
    expect(validateItemType("fake")).toBeNull();
    expect(validateItemType("")).toBeNull();
    expect(validateItemType("123")).toBeNull();
  });
});
