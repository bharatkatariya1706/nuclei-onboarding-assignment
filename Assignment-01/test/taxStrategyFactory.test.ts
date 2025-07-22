import { describe, it, expect } from "vitest";
import { ImportedItemStrategy, ManufacturedItemStrategy, RawItemTaxStrategy } from "../src/tax/strategies/taxStrategies";
import { TaxStrategyFactory } from "../src/factories/taxStrategyFactory";


describe("TaxStrategyFactory", () => {
  it("should return RawItemTaxStrategy for RAW", () => {
    const strategy = TaxStrategyFactory.getStrategy("raw");
    expect(strategy).toBeInstanceOf(RawItemTaxStrategy);
  });

  it("should return ManufacturedItemStrategy for MANUFACTURED", () => {
    const strategy = TaxStrategyFactory.getStrategy("manufactured");
    expect(strategy).toBeInstanceOf(ManufacturedItemStrategy);
  });

  it("should return ImportedItemStrategy for IMPORTED", () => {
    const strategy = TaxStrategyFactory.getStrategy("imported");
    expect(strategy).toBeInstanceOf(ImportedItemStrategy);
  });

  it("should be case insensitive and trim the input", () => {
    const strategy1 = TaxStrategyFactory.getStrategy("  RAW ");
    const strategy2 = TaxStrategyFactory.getStrategy("ImPoRtEd");
    expect(strategy1).toBeInstanceOf(RawItemTaxStrategy);
    expect(strategy2).toBeInstanceOf(ImportedItemStrategy);
  });

  it("should throw an error for unsupported type", () => {
    expect(() => TaxStrategyFactory.getStrategy("fake")).toThrowError(
      "Unsupported item type: fake"
    );
    expect(() => TaxStrategyFactory.getStrategy("")).toThrow();
  });
});
