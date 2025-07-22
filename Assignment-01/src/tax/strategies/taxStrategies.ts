// interface that mentions the methods needed to calculate taxes
export interface TaxStrategy {
  calculateTax(price: number): number;
}

// class that extends TaxStrategy for raw type to calculate tax based on raw item tax strategy
export class RawItemTaxStrategy implements TaxStrategy {
  calculateTax(price: number): number {
    return price * 0.125;
  }
}

// class that extends TaxStrategy for manufactured type to calculate tax based on manufactured item tax strategy
export class ManufacturedItemStrategy implements TaxStrategy {
  calculateTax(price: number): number {
    const baseTax = price * 0.125;
    const surcharge = 0.02 * (price + baseTax);
    return baseTax + surcharge;
  }
}

// class that extends TaxStrategy for imported type to calculate tax based on imported item tax strategy
export class ImportedItemStrategy implements TaxStrategy {
  calculateTax(price: number): number {
    const importDuty = price * 0.1;
    const priceAfterImportDuty = price + importDuty;
    let surcharge = 0;
    if (priceAfterImportDuty <= 100) {
      surcharge = 5;
    } else if (priceAfterImportDuty > 100 && priceAfterImportDuty <= 200) {
      surcharge = 10;
    } else {
      surcharge = 0.05 * priceAfterImportDuty;
    }
    return importDuty + surcharge;
  }
}
