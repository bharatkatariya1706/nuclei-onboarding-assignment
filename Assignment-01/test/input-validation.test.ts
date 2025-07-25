import { describe, it, vi, expect } from "vitest";
import * as validations  from "../src/utils/input-validation.js";
import { ItemType } from "../src/models/item-type.js";

vi.mock("../model/itemType.js", () => ({
  ItemType,
}));

// test cases for input validation functions
describe("validatePrice", () => {
  it("should return number when valid price is passed", () => {
    expect(validations.validatePrice("100")).toBe(100);
    expect(validations.validatePrice("99.99")).toBe(99.99);
    expect(validations.validatePrice("0")).toBe(0);
  });

  it("should return null for invalid or negative price", () => {
    expect(validations.validatePrice("abc")).toBeNull();
    expect(validations.validatePrice("-5")).toBeNull();
    expect(validations.validatePrice("")).toBeNull();
  });
});

describe("validateQuantity", () => {
  it("should return number when valid quantity is passed", () => {
    expect(validations.validateQuantity("5")).toBe(5);
    expect(validations.validateQuantity("1")).toBe(1);
  });

  it("should return null for invalid or zero/negative quantity", () => {
    expect(validations.validateQuantity("0")).toBeNull();
    expect(validations.validateQuantity("-3")).toBeNull();
    expect(validations.validateQuantity("abc")).toBeNull();
    expect(validations.validateQuantity("")).toBeNull();
  });
});

describe("validateItemType", () => {
  it("should return correct ItemType for valid input (case insensitive)", () => {
    expect(validations.validateItemType("raw")).toBe(ItemType.RAW);
    expect(validations.validateItemType("RAW")).toBe(ItemType.RAW);
    expect(validations.validateItemType("  manufactured ")).toBe(ItemType.MANUFACTURED);
    expect(validations.validateItemType("ImPoRtEd")).toBe(ItemType.IMPORTED);
  });

  it("should return null for invalid item type", () => {
    expect(validations.validateItemType("fake")).toBeNull();
    expect(validations.validateItemType("")).toBeNull();
    expect(validations.validateItemType("123")).toBeNull();
  });
});
