import { ItemType } from "../model/itemType.js";
import {
  ImportedItemStrategy,
  ManufacturedItemStrategy,
  RawItemTaxStrategy,
  TaxStrategy,
} from "../tax/strategies/taxStrategies.js";

// this will create a factory class that will return the tax strategy based on the item type
export class TaxStrategyFactory {
  static getStrategy(type: string): TaxStrategy {
    const typeOfItem = type.trim().toLowerCase() as ItemType;

    switch (typeOfItem) {
      case ItemType.RAW:
        return new RawItemTaxStrategy();
      case ItemType.MANUFACTURED:
        return new ManufacturedItemStrategy();
      case ItemType.IMPORTED:
        return new ImportedItemStrategy();
      default:
        throw new Error(`Unsupported item type: ${type}`);
    }
  }
}
