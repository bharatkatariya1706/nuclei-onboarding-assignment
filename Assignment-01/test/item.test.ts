import { describe, it, expect } from "vitest";
import { RawItem, ManufacturedItem, ImportedItem } from "../src/models/item.js";

// test cases for RawItem
describe("RawItem", () => {
  it("should calculate 12.5% tax correctly", () => {
    const item = new RawItem("Pen", 100, 1, "raw");
    item.calculateTax();

    const summary = item.getSummary();
    expect(summary.tax).toBeCloseTo(12.5);
    expect(summary.totalPrice).toBeCloseTo(112.5);
  });
});

// test cases for ManufacturedItem
describe("ManufacturedItem", () => {
  it("should calculate 12.5% base tax + 2% surcharge correctly", () => {
    const item = new ManufacturedItem("Toy", 100, 1, "manufactured");
    item.calculateTax();

    const baseTax = 100 * 0.125; // 12.5
    const surcharge = 0.02 * (100 + baseTax); // 2.25
    const expectedTax = baseTax + surcharge; // 14.75
    const expectedTotal = 100 + expectedTax; // 114.75

    const summary = item.getSummary();
    expect(summary.tax).toBeCloseTo(expectedTax);
    expect(summary.totalPrice).toBeCloseTo(expectedTotal);
  });
});

// test cases for ImportedItem
describe("ImportedItem", () => {
  it("should add flat surcharge of 5 if total <= 100", () => {
    const item = new ImportedItem("Book", 50, 1, "imported");
    item.calculateTax();

    const importDuty = 50 * 0.1; // 5
    const surcharge = 5;
    const tax = importDuty + surcharge; // 10
    const total = 50 + tax; // 60

    const summary = item.getSummary();
    expect(summary.tax).toBeCloseTo(10);
    expect(summary.totalPrice).toBeCloseTo(60);
  });

  it("should add flat surcharge of 10 if total > 100 and <= 200", () => {
    const item = new ImportedItem("Shoes", 150, 1, "imported");
    item.calculateTax();

    const importDuty = 150 * 0.1; // 15
    const surcharge = 10;
    const tax = importDuty + surcharge; // 25
    const total = 150 + tax; // 175

    const summary = item.getSummary();
    expect(summary.tax).toBeCloseTo(25);
    expect(summary.totalPrice).toBeCloseTo(175);
  });

  it("should add 5% surcharge if total > 200", () => {
    const item = new ImportedItem("Laptop", 300, 1, "imported");
    item.calculateTax();

    const importDuty = 300 * 0.1; // 30
    const costAfterImport = 330;
    const surcharge = 0.05 * costAfterImport; // 16.5
    const tax = importDuty + surcharge; // 46.5
    const total = 300 + tax; // 346.5

    const summary = item.getSummary();
    expect(summary.tax).toBeCloseTo(46.5);
    expect(summary.totalPrice).toBeCloseTo(346.5);
  });
});
