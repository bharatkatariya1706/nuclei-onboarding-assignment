import { describe, test, expect, vi, beforeEach } from "vitest";
import * as inputModule from "../src/utils/input.js";
import { processNewItem } from "../src/index.js";

describe("processNewItem", () => {
  let logSpy: any;
  let tableSpy: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    tableSpy = vi.spyOn(console, "table").mockImplementation(() => {});
  });

  test("raw item", async () => {
    const inputs = ["Pen", "100", "1", "raw"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(inputs.shift()!)
    );

    await processNewItem();

    expect(tableSpy).toHaveBeenCalledWith({
      Name: "Pen",
      Price: 100,
      Type: "raw",
      Tax: 12.5,
      "Total Price": 112.5,
    });
  });

  test("manufactured item", async () => {
    const inputs = ["Book", "200", "1", "manufactured"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(inputs.shift()!)
    );

    await processNewItem();

    // Manufactured tax = 12.5% + 2% of (price + 12.5% of price)
    expect(tableSpy).toHaveBeenCalledWith({
      Name: "Book",
      Price: 200,
      Type: "manufactured",
      Tax: 29.5,
      "Total Price": 229.5,
    });
  });

  test("imported item", async () => {
    const inputs = ["Phone", "300", "1", "imported"];
    vi.spyOn(inputModule, "getUserInput").mockImplementation(() =>
      Promise.resolve(inputs.shift()!)
    );

    await processNewItem();

    // Import duty = 10% = 30, surcharge = 5% of 330 = 16.5
    // total = 330 + 16.5 = 346.5
    expect(tableSpy).toHaveBeenCalledWith({
      Name: "Phone",
      Price: 300,
      Type: "imported",
      Tax: 46.5,
      "Total Price": 346.5,
    });
  });
});
