import { getUserInput } from "./utils/input.js";
import { Item } from "./model/item.js";

// function to process each new item entered by the user
export async function processNewItem() {
  const item = new Item();

  const name = await getUserInput("Enter the Item Name : ");
  item.setItemName(name);

  const priceString = await getUserInput("Enter the Item Price : ");
  const price = parseFloat(priceString);
  if (!isNaN(price) && price > 0) {
    item.setItemPrice(price);
  } else {
    console.log("Please enter a valid price..");
    return;
  }

  const quantityString = await getUserInput("Enter the Item Quantity : ");
  const quantity = parseInt(quantityString);
  if (!isNaN(quantity) && quantity > 0) {
    item.setItemQuantity(quantity);
  } else {
    console.log("Please enter a valid quantity..");
    return;
  }

  const type = await getUserInput(
    "Enter the Item Type (raw/manufactured/imported) : "
  );

  // Validating the item type and calculating the total price based on the type
  switch (type) {
    case "raw":
      const rawTotalPrice = item.getItemPrice() + item.getItemPrice() * 0.125;
      item.setTotalPrice(rawTotalPrice);
      break;

    case "manufactured":
      const manufactureTotalPrice =
        item.getItemPrice() +
        0.125 * item.getItemPrice() +
        0.02 * (item.getItemPrice() + 0.125 * item.getItemPrice());
      item.setTotalPrice(manufactureTotalPrice);
      break;

    case "imported":
      const finalCost = item.getItemPrice() + 0.1 * item.getItemPrice();
      let surcharge =
        finalCost <= 100 ? 5 : finalCost <= 200 ? 10 : 0.05 * finalCost;
      item.setTotalPrice(finalCost + surcharge);
      break;

    default:
      console.log("Invalid item type. Please try again.");
      return;
  }

  item.setItemType(type);
  item.setTax(item.getTotalPrice() - item.getItemPrice());

  // Showing the item details in a tablular format to the user after all the calculations
  console.log("\nItem Details:");
  console.table({
    Name: item.getItemName(),
    Price: item.getItemPrice(),
    Type: item.getItemType(),
    Tax: item.getTax(),
    "Total Price": item.getTotalPrice(),
  });
  console.log();
}


// main fucntion to handle the flow of the program 
export async function main() {
    //if user to wanted to enter the details of the item - initilly set to true
  let moreToBeInserted = true;

  while (moreToBeInserted) {
    await processNewItem();
    const response = await getUserInput(
      "Do you want to enter details of any other item? (yes/no) : "
    );
    //if user wants to enter more items
    moreToBeInserted = response.trim().toLowerCase() === "yes";
  }
  process.exit();
}

// calling the main function and catching any errors
main().catch(console.error);