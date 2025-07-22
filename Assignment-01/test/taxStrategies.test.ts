import { describe, it, expect } from "vitest";
import {
  ImportedItemStrategy,
  ManufacturedItemStrategy,
  RawItemTaxStrategy,
} from "../src/tax/strategies/taxStrategies";

describe("RawItemTaxStrategy", () => {
  it("should calculate 12.5% tax", () => {
    const strategy = new RawItemTaxStrategy();
    expect(strategy.calculateTax(100)).toBeCloseTo(12.5);
    expect(strategy.calculateTax(0)).toBe(0);
  });
});

describe("ManufacturedItemStrategy", () => {
  it("should calculate tax with base + surcharge", () => {
    const strategy = new ManufacturedItemStrategy();
    // price = 100
    // baseTax = 12.5
    // surcharge = 2% of (100 + 12.5) = 2.25
    // total = 14.75
    expect(strategy.calculateTax(100)).toBeCloseTo(14.75);

    // edge case: price = 0
    expect(strategy.calculateTax(0)).toBe(0);
  });
});

describe("ImportedItemStrategy", () => {
  it("should calculate correct surcharge for <= 100", () => {
    const strategy = new ImportedItemStrategy();
    // price = 50
    // import duty = 5
    // total = 5 + surcharge 5 = 10
    expect(strategy.calculateTax(50)).toBe(10);
  });

  it("should calculate correct surcharge for > 100 and <= 200", () => {
    const strategy = new ImportedItemStrategy();
    // price = 150
    // import duty = 15
    // total = 15 + surcharge 10 = 25
    expect(strategy.calculateTax(150)).toBe(25);
  });

  it("should calculate 5% surcharge for > 200", () => {
    const strategy = new ImportedItemStrategy();
    // price = 300
    // import duty = 30
    // priceAfterImportDuty = 330
    // surcharge = 0.05 * 330 = 16.5
    // total = 30 + 16.5 = 46.5
    expect(strategy.calculateTax(300)).toBeCloseTo(46.5);
  });

  it("should handle zero price", () => {
    const strategy = new ImportedItemStrategy();
    expect(strategy.calculateTax(0)).toBe(5); // surcharge applies even if price is 0
  });
});
