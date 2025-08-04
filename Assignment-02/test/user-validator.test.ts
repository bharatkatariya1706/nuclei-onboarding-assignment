import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserValidator } from "../src/utils/validators/user-validator.js";

// Mock repository
vi.mock("../src/repositories/user-repository", () => {
  const users = [
    {
      rollNumber: 1,
      fullName: "Test User",
      age: 25,
      address: "Delhi",
      courses: ["A", "B", "C", "D"],
    },
  ];

  return {
    UserRepository: {
      getInstance: () => ({
        getUsers: () => users,
      }),
    },
  };
});

describe("UserValidator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validUser = {
    fullName: "John Doe",
    age: 25,
    address: "New York",
    rollNumber: 2,
    courses: ["A", "B", "C", "D"],
  };

  it("should pass for valid user", () => {
    expect(() => UserValidator.validate(validUser)).not.toThrow();
  });

  it("should throw for missing fields", () => {
    expect(() => UserValidator.validate({})).toThrow(
      "Missing fields: Full Name, Age, Address, Roll Number, Courses."
    );
  });

  it("should throw for invalid full name", () => {
    const invalid = { ...validUser, fullName: "" };
    expect(() => UserValidator.validateFullName(invalid.fullName)).toThrow(
      "Full Name cannot be empty."
    );
  });
   it("should throw an error if full name contains non-alphabetic characters", () => {
     expect(() => UserValidator.validateFullName("John123")).toThrow(
       "Full Name must contain only alphabets and spaces."
     );
   });

  it("should throw if full name is not a string", () => {
    expect(() => UserValidator.validateFullName(123 as any)).toThrow(
      "Full Name must be a string."
    );
  });

 
  it("should throw if address is not a string", () => {
    expect(() => UserValidator.validateAddress(123 as any)).toThrow(
      "Address must be a string."
    );
  });

   it("should throw an error if address is empty or only spaces", () => {
     expect(() => UserValidator.validateAddress("   ")).toThrow(
       "Address cannot be empty."
     );
   });


  it("should throw for non-numeric age", () => {
    expect(() => UserValidator.validateAge("twenty")).toThrow(
      "Age must be a number."
    );
  });

  it("should throw for age over 100", () => {
    expect(() => UserValidator.validateAge(130)).toThrow(
      "Age must be a realistic value (<= 100)."
    );
  });

  it("should throw an error if age is 0 or less", () => {
    expect(() => UserValidator.validateAge(0)).toThrow(
      "Age must be greater than 0."
    );
    expect(() => UserValidator.validateAge(-5)).toThrow(
      "Age must be greater than 0."
    );
  });

  it("should throw for negative roll number", () => {
    expect(() => UserValidator.validateRollNumber(-1)).toThrow(
      "Roll Number must be a positive number."
    );
  });

  it("should throw for non-integer roll number", () => {
    expect(() => UserValidator.validateRollNumber(1.5)).toThrow(
      "Roll Number must be an integer."
    );
  });

  it("should throw for non-numeric roll number (string)", () => {
    expect(() => UserValidator.validateRollNumber("abc")).toThrow(
      "Roll Number must be a number."
    );
  });

  it("should throw for NaN roll number", () => {
    expect(() => UserValidator.validateRollNumber(NaN)).toThrow(
      "Roll Number must be a number."
    );
  });

  it("should throw for duplicate roll number", () => {
    expect(() => UserValidator.ensureRollNumberIsUnique(1)).toThrow(
      "Roll Number 1 already exists. Please use a unique one."
    );
  });

  it("should throw for non-array courses", () => {
    expect(() => UserValidator.validateCourses("ABC")).toThrow(
      "Courses must be entered as an array."
    );
  });

  it("should throw for invalid course names", () => {
    expect(() => UserValidator.validateCourses(["A", "B", "Z", "D"])).toThrow(
      "Invalid course(s): Z. Valid choices: A-F."
    );
  });

  it("should throw for duplicate courses", () => {
    expect(() => UserValidator.validateCourses(["A", "A", "B", "C"])).toThrow(
      "Duplicate courses detected. Each course must be unique."
    );
  });

  it("should throw for not exactly 4 courses", () => {
    expect(() => UserValidator.validateCourses(["A", "B", "C"])).toThrow(
      "You must enter exactly 4 courses."
    );
  });

  it("should treat roll number 0 as valid in required fields", () => {
    const user = { ...validUser, rollNumber: 0 };
    expect(() => UserValidator.validateRequiredFields(user)).not.toThrow();
  });

  it("should throw if roll number is completely missing", () => {
   const user = { ...validUser } as Partial<typeof validUser>;
   delete user.rollNumber;
    expect(() => UserValidator.validate(user)).toThrow(
      "Missing fields: Roll Number."
    );
  });

  it("should throw if age is missing (not even 0)", () => {
   const user = { ...validUser } as Partial<typeof validUser>;
   delete user.age;

    expect(() => UserValidator.validate(user)).toThrow("Missing fields: Age.");
  });
});
