// class that serves blueprint form all the items entered by the user
export class Item {
  //Properties of the item
  private itemName: string;
  private itemPrice: number;
  private itemQuantity: number;
  private itemType: string;
  private tax: number;
  private totalPrice: number;
  //default constructor to initialize the properties of the item class
  constructor() {
    this.itemName = "";
    this.itemPrice = 0;
    this.itemQuantity = 0;
    this.itemType = "";
    this.tax = 0;
    this.totalPrice = 0;
  }

  //getters and setters for the properties of the item class
  public setItemName(itemName: string): void {
    this.itemName = itemName;
  }

  public getItemName(): string {
    return this.itemName;
  }

  public setItemPrice(itemPrice: number): void {
    this.itemPrice = itemPrice;
  }

  public getItemPrice(): number {
    return this.itemPrice;
  }

  setItemQuantity(itemQuantity: number): void {
    this.itemQuantity = itemQuantity;
  }

  getItemQuantity(): number {
    return this.itemQuantity;
  }

  setItemType(itemType: string): void {
    this.itemType = itemType;
  }

  getItemType(): string {
    return this.itemType;
  }

  setTax(tax: number): void {
    this.tax = tax;
  }
  getTax(): number {
    return this.tax;
  }
  setTotalPrice(totalPrice: number): void {
    this.totalPrice = totalPrice;
  }
  getTotalPrice(): number {
    return this.totalPrice;
  }
}
