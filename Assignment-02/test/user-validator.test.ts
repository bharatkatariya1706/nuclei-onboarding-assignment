import { describe, it, expect, beforeEach } from "vitest";
import { UserRepository } from "../src/repositories/user-repository";
import { UserValidator } from "../src/utils/validators/user-validator";
import { User } from "../src/models/user";
;

// Setup
const validUserData = {
  fullName: "John Doe",
  age: 22,
  address: "Delhi",
  rollNumber: 101,
  courses: ["A", "B", "C", "D"],
};

describe("UserValidator", () => {
  beforeEach(() => {
    // Reset repo before each test
    const repo = UserRepository.getInstance();
    repo.setUsers([]);
  });

  it("should throw error if any field is missing", () => {
    expect(() => UserValidator.validate({})).toThrow(
      "All fields are required."
    );
  });

  it("should throw if fullName is empty", () => {
    const data = { ...validUserData, fullName: "   " };
    expect(() => UserValidator.validate(data)).toThrow(
      "Full Name must be a non-empty string."
    );
  });

  it("should throw if address is empty", () => {
    const data = { ...validUserData, address: "    " };
    expect(() => UserValidator.validate(data)).toThrow(
      "Address must be a non-empty string."
    );
  });

  it("should throw if age is invalid", () => {
    const data = { ...validUserData, age: -1 };
    expect(() => UserValidator.validate(data)).toThrow(
      "Age must be a positive number."
    );
  });

  it("should throw if roll number is not a number", () => {
    const data = { ...validUserData, rollNumber: NaN };
    expect(() => UserValidator.validate(data)).toThrow(
      "Roll Number must be a number."
    );
  });

  it("should throw if roll number already exists", () => {
    const repo = UserRepository.getInstance();
    repo.addUser(validUserData as User);
    const data = { ...validUserData }; // same rollNumber
    expect(() => UserValidator.validate(data)).toThrow(
      "Roll Number 101 already exists."
    );
  });

  it("should throw if courses is not array", () => {
    const data = { ...validUserData, courses: "ABC" };
    expect(() => UserValidator.validate(data)).toThrow(
      "Courses must be provided as an array."
    );
  });

  it("should throw if not exactly 4 courses", () => {
    const data = { ...validUserData, courses: ["A", "B"] };
    expect(() => UserValidator.validate(data)).toThrow(
      "Exactly 4 courses must be selected."
    );
  });

  it("should throw if course is invalid", () => {
    const data = { ...validUserData, courses: ["A", "B", "C", "X"] };
    expect(() => UserValidator.validate(data)).toThrow(
      "Invalid course(s): X. Choose from A-F only."
    );
  });

  it("should throw if duplicate courses are selected", () => {
    const data = { ...validUserData, courses: ["A", "A", "B", "C"] };
    expect(() => UserValidator.validate(data)).toThrow(
      "Duplicate courses selected. Please select 4 unique courses."
    );
  });

  it("should pass for valid user", () => {
    const data = { ...validUserData };
    expect(() => UserValidator.validate(data)).not.toThrow();
  });
});
