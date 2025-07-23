// abstract class that defines the structure for different item types
export abstract class Item {
  constructor(
    protected itemName: string,
    protected itemPrice: number,
    protected itemQuantity: number,
    protected itemType: string
  ) {}

  protected tax: number = 0;
  protected totalPrice: number = 0;

  abstract calculateTax(): void;

  //this function returns a summary of the item
  public getSummary() {
    return {
      name: this.itemName,
      price: this.itemPrice,
      quantity: this.itemQuantity,
      type: this.itemType,
      tax: this.tax,
      totalPrice: this.totalPrice,
    };
  }
}

// Concrete item classes for  raw item
export class RawItem extends Item {
  calculateTax(): void {
    this.tax = this.itemPrice * 0.125;
    this.totalPrice = this.itemPrice + this.tax;
  }
}

// Concrete item class for manufactured item
export class ManufacturedItem extends Item {
  calculateTax(): void {
    const baseTax = this.itemPrice * 0.125;
    const surcharge = 0.02 * (this.itemPrice + baseTax);
    this.tax = baseTax + surcharge;
    this.totalPrice = this.itemPrice + this.tax;
  }
}

// Concrete item class for imported item
export class ImportedItem extends Item {
  calculateTax(): void {
    const importDuty = this.itemPrice * 0.1;
    const costAfterImport = this.itemPrice + importDuty;
    let surcharge = 0;

    if (costAfterImport <= 100) {
      surcharge = 5;
    } else if (costAfterImport <= 200) {
      surcharge = 10;
    } else {
      surcharge = 0.05 * costAfterImport;
    }

    this.tax = importDuty + surcharge;
    this.totalPrice = this.itemPrice + this.tax;
  }
}
