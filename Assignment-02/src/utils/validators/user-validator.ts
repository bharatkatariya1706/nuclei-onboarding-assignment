import { User } from "../../models/user.js";
import { UserRepository } from "../../repositories/user-repository.js";

export class UserValidator {
  static validate(data: any): void {
    this.validateRequiredFields(data);
    this.validateFullName(data.fullName);
    this.validateAddress(data.address);
    this.validateAge(data.age);
    this.validateRollNumber(data.rollNumber);
    this.validateCourses(data.courses);
    this.ensureRollNumberIsUnique(data.rollNumber);
  }

  // Validate that all required fields are present
  public static validateRequiredFields(data: any): void {
    const missingFields: string[] = [];
    if (!data.fullName) missingFields.push("Full Name");
    if (!data.age && data.age !== 0) missingFields.push("Age");
    if (!data.address) missingFields.push("Address");
    if (!data.rollNumber && data.rollNumber !== 0)
      missingFields.push("Roll Number");
    if (!data.courses) missingFields.push("Courses");

    if (missingFields.length > 0) {
      throw new Error(` Missing fields: ${missingFields.join(", ")}.`);
    }
  }
// Validate that full name is a non-empty string with only alphabets and spaces
  public static validateFullName(fullName: any): void {
    if (typeof fullName !== "string") {
      throw new Error("Full Name must be a string.");
    }
    if (fullName.trim().length === 0) {
      throw new Error("Full Name cannot be empty.");
    }
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      throw new Error("Full Name must contain only alphabets and spaces.");
    }
  }

  // Validate that address is a non-empty 
  public static validateAddress(address: any): void {
    if (typeof address !== "string") {
      throw new Error("Address must be a string.");
    }
    if (address.trim().length === 0) {
      throw new Error("Address cannot be empty.");
    }
    
  }
// Validate that age is a number greater than 0 and less than 100
  public static validateAge(age: any): void {
    if (typeof age !== "number" || isNaN(age)) {
      throw new Error("Age must be a number.");
    }
    if (age <= 0) {
      throw new Error("Age must be greater than 0.");
    }
    if (age > 100) {
      throw new Error("Age must be a realistic value (<= 100).");
    }
  }

// Validate that roll number is a positive integer and unique
  public static validateRollNumber(rollNumber: any): void {
    if (typeof rollNumber !== "number" || isNaN(rollNumber)) {
      throw new Error("Roll Number must be a number.");
    }
    if (rollNumber <= 0) {
      throw new Error("Roll Number must be a positive number.");
    }
    if (!Number.isInteger(rollNumber)) {
      throw new Error("Roll Number must be an integer.");
    }
  }

// Ensure roll number is unique in the repository
  public static ensureRollNumberIsUnique(rollNumber: number): void {
    const repo = UserRepository.getInstance();
    const existing = repo.getUsers().find((u) => u.rollNumber === rollNumber);
    if (existing) {
      throw new Error(
        `Roll Number ${rollNumber} already exists. Please use a unique one.`
      );
    }
  }
// Validate that courses are an array of exactly 4 unique strings from A-F
  public static validateCourses(courses: any): void {
    const allowedCourses = ["A", "B", "C", "D", "E", "F"];

    if (!Array.isArray(courses)) {
      throw new Error("Courses must be entered as an array.");
    }

    const trimmed = courses.map((c: string) => c.trim().toUpperCase());

    if (trimmed.length !== 4) {
      throw new Error("You must enter exactly 4 courses.");
    }

    const invalidCourses = trimmed.filter((c) => !allowedCourses.includes(c));
    if (invalidCourses.length > 0) {
      throw new Error(
        `Invalid course(s): ${invalidCourses.join(
          ", "
        )}. Valid choices: A-F.`
      );
    }

    const uniqueSet = new Set(trimmed);
    if (uniqueSet.size !== 4) {
      throw new Error(
        "Duplicate courses detected. Each course must be unique."
      );
    }
  }
}
