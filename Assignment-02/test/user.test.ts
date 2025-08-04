import { describe, it, expect } from "vitest";
import { User } from "../src/models/user";

describe("User Class", () => {
  const user = new User("Bharat Katariya", 22, "Indore, India", 112, [
    "A",
    "B",
    "C",
    "D",
  ]);

  it("should have a valid fullName", () => {
    expect(typeof user.fullName).toBe("string");
    expect(user.fullName.length).toBeGreaterThan(0);
  });

  it("should have a valid age", () => {
    expect(typeof user.age).toBe("number");
    expect(user.age).toBeGreaterThan(0);
  });

  it("should have a valid address", () => {
    expect(typeof user.address).toBe("string");
    expect(user.address.length).toBeGreaterThan(0);
  });

  it("should have a valid rollNumber", () => {
    expect(typeof user.rollNumber).toBe("number");
  });

  it("should have exactly 4 valid courses", () => {
    expect(Array.isArray(user.courses)).toBe(true);
    expect(user.courses.length).toBe(4);
    user.courses.forEach((c) => {
      expect(["A", "B", "C", "D", "E", "F"]).toContain(c);
    });
  });
});
