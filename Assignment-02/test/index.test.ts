import { describe, it, expect, vi } from "vitest";

// Mock the CLI class
vi.mock("../src/cli/cli", () => {
  return {
    CLI: vi.fn().mockImplementation(() => ({
      run: vi.fn(),
    })),
  };
});


import "../src/index";
import { CLI } from "../src/cli/cli";

describe("Entry Point", () => {
  it("should create CLI instance and call run", () => {
    expect(CLI).toHaveBeenCalled(); // constructor called
    const mockInstance = (CLI as any).mock.results[0].value;
    expect(mockInstance.run).toHaveBeenCalled(); // run method called
  });
});
