
import { User } from "../../models/user.js";
import { UserRepository } from "../../repositories/user-repository.js";

export class UserValidator {
  static validate(data: any): void {
    const { fullName, age, address, rollNumber, courses } = data;

    // all data is neccessary , if any is missing then throw error
    if (
      !fullName ||
      !address ||
      age == null ||
      rollNumber == null ||
      !courses
    ) {
      throw new Error("All fields are required.");
    }

    // Type and value checks
    if (typeof fullName !== "string" || fullName.trim() === "") {
      throw new Error("Full Name must be a non-empty string.");
    }

    if (typeof address !== "string" || address.trim() === "") {
      throw new Error("Address must be a non-empty string.");
    }

    if (typeof age !== "number" || isNaN(age) || age <= 0) {
      throw new Error("Age must be a positive number.");
    }

    if (typeof rollNumber !== "number" || isNaN(rollNumber)) {
      throw new Error("Roll Number must be a number.");
    }

    //if user exist already with same roll number then throw error
    const existingUser = UserRepository.getInstance()
      .getUsers()
      .find((u) => u.rollNumber === rollNumber);
    if (existingUser) {
      throw new Error(`Roll Number ${rollNumber} already exists.`);
    }

    // Course validation
    if (!Array.isArray(courses)) {
      throw new Error("Courses must be provided as an array.");
    }

    const allowedCourses = ["A", "B", "C", "D", "E", "F"];
    
    //check courses entered by users are valid or not
    const validCourses = courses.map((c) => c.trim().toUpperCase());

    if (validCourses.length !== 4) {
      throw new Error("Exactly 4 courses must be selected.");
    }

    const invalid = validCourses.filter((c) => !allowedCourses.includes(c));
    if (invalid.length > 0) {
      throw new Error(
        `Invalid course(s): ${invalid.join(", ")}. Choose from A-F only.`
      );
    }

    const uniqueCourses = new Set(validCourses);
    if (uniqueCourses.size !== 4) {
      throw new Error(
        "Duplicate courses selected. Please select 4 unique courses."
      );
    }
  }
}
