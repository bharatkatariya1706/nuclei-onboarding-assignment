
import { describe, it, expect } from "vitest";
import { getUserInput } from "./../src/utils/input.js";

// Group test cases related to getUserInput
describe("getUserInput", () => {
  // Define a single test case
  it("should return user input trimmed", async () => {
   
    const mockInput = "    test for User Input          \n";

    process.nextTick(() => {
      process.stdin.emit("data", Buffer.from(mockInput));
    });

    // Call the function and wait for it to resolve
    const result = await getUserInput("Enter your name:");

    // compare the result with expected output
    expect(result).toBe("test for User Input");
  });
});
