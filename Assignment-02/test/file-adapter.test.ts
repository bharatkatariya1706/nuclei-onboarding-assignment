import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { FileAdapter } from "../src/adapters/file-adapter";
import { User } from "../src/models/user";

import { writeFileSync, readFileSync, existsSync } from "fs";

// Mock fs methods
vi.mock("fs");

const mockUser: User = {
  fullName: "Alice",
  age: 20,
  address: "Delhi",
  rollNumber: 1,
  courses: ["A", "B", "C", "D"],
};

describe("FileAdapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save users to file", () => {
    FileAdapter.save([mockUser]);

    expect(writeFileSync).toHaveBeenCalledWith(
      "./data/users.txt",
      JSON.stringify([mockUser], null, 2),
      "utf-8"
    );
  });

  it("should return empty array if file does not exist", () => {
    (existsSync as Mock).mockReturnValue(false);
    const result = FileAdapter.load();
    expect(result).toEqual([]);
  });

  it("should return empty array if file is empty", () => {
    (existsSync as Mock).mockReturnValue(true);
    (readFileSync as Mock).mockReturnValue("   ");
    const result = FileAdapter.load();
    expect(result).toEqual([]);
  });

  it("should load users from file", () => {
    (existsSync as Mock).mockReturnValue(true);
    (readFileSync as Mock).mockReturnValue(JSON.stringify([mockUser]));
    const result = FileAdapter.load();
    expect(result).toEqual([mockUser]);
  });

  it("should return [] and log error on invalid JSON", () => {
    (existsSync as Mock).mockReturnValue(true);
    (readFileSync as Mock).mockImplementation(() => {
      throw new Error("File read error");
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = FileAdapter.load();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
