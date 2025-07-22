import { getUserInput } from "./utils/input.js";
import { Item } from "./model/item.js";
import { ItemFactory } from "./factories/itemFactories.js";

// function to process each new item entered by the user
export async function processNewItem() {
  // use itemFactory to create a new item object
  const item = await ItemFactory.createItem();
  if (item === null) return;

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
