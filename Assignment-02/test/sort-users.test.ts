import { describe, it, expect } from "vitest";
import { sortUsers } from "../src/utils/sort-users";
import { User } from "../src/models/user";

const users: User[] = [
  {
    fullName: "Charlie",
    age: 22,
    address: "Delhi",
    rollNumber: 103,
    courses: ["A"],
  },
  {
    fullName: "Alice",
    age: 25,
    address: "Mumbai",
    rollNumber: 101,
    courses: ["B"],
  },
  {
    fullName: "Bob",
    age: 23,
    address: "Kolkata",
    rollNumber: 102,
    courses: ["C"],
  },
];

describe("sortUsers", () => {
  it("should sort by fullName ascending", () => {
    const sorted = sortUsers(users, "fullname", "asc");
    expect(sorted.map((u) => u.fullName)).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("should sort by fullName descending", () => {
    const sorted = sortUsers(users, "fullname", "desc");
    expect(sorted.map((u) => u.fullName)).toEqual(["Charlie", "Bob", "Alice"]);
  });

  it("should sort by rollNumber ascending", () => {
    const sorted = sortUsers(users, "rollnumber", "asc");
    expect(sorted.map((u) => u.rollNumber)).toEqual([101, 102, 103]);
  });

  it("should sort by rollNumber descending", () => {
    const sorted = sortUsers(users, "rollnumber", "desc");
    expect(sorted.map((u) => u.rollNumber)).toEqual([103, 102, 101]);
  });

  it("should sort by age ascending", () => {
    const sorted = sortUsers(users, "age", "asc");
    expect(sorted.map((u) => u.age)).toEqual([22, 23, 25]);
  });

  it("should sort by address descending", () => {
    const sorted = sortUsers(users, "address", "desc");
    expect(sorted.map((u) => u.address)).toEqual([
      "Mumbai",
      "Kolkata",
      "Delhi",
    ]);
  });

  it("should throw error on empty user list", () => {
    expect(() => sortUsers([], "age", "asc")).toThrow(
      "Invalid or empty user list provided for sorting."
    );
  });

  it("should throw error on invalid sort field", () => {
    expect(() => sortUsers(users, "invalid" as any, "asc")).toThrow(
      "Invalid sort field"
    );
  });

  it("should return 0 when values are equal", () => {
    const equalUsers: User[] = [
      {
        fullName: "John",
        age: 30,
        address: "Pune",
        rollNumber: 1,
        courses: ["A"],
      },
      {
        fullName: "John",
        age: 30,
        address: "Pune",
        rollNumber: 2,
        courses: ["B"],
      },
    ];

    const sorted = sortUsers(equalUsers, "fullname", "asc");
    expect(sorted[0].rollNumber).toBe(1);
    expect(sorted[1].rollNumber).toBe(2);
  });

});
