import { getUserInput } from "./utils/input.js";
import { ItemFactory } from "./factories/item-factory.js";
import { Item } from "./models/item.js";
import { getValidatedItemInput, ItemInputData } from "./utils/input-handler.js";

// Function to process each new item entered by the user
export async function processNewItem() {
  // Get validated item input asynchronously
  const data: ItemInputData | null = await getValidatedItemInput();
  if (!data) return;

  // Use the ItemFactory to create a new item object
  const item: Item | null = await ItemFactory.createItem(data);
  if (!item) return;

  // Show the item details in a tabular format
  console.log("\nItem Details:");
  console.table(item.getSummary());
  console.log();
}

// Main function to handle the program flow
export async function main() {
  try {
    let moreToBeInserted = true;

    while (moreToBeInserted) {
      await processNewItem();
      const response = await getUserInput(
        "Do you want to enter details of any other item? (yes/no): "
      );
      moreToBeInserted = response.trim().toLowerCase() === "yes";
    }

    console.log("All items have been processed successfully.");
  } catch (error) {
    console.error(error);
  }
}

// calling main function to start the program
main();
