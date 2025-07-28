import { User } from "../models/user.js";
import { UserRepository } from "../repositories/user-repository.js";
import { UserValidator } from "../utils/validators/user-validator.js";

// Factory Pattern: Responsible for validating and creating a valid User object
export class UserFactory {
  static createUser(data: any): User {
    const { fullName, age, address, rollNumber, courses } = data;

    // Validate user data
    UserValidator.validate(data);

    const user = new User(
      data.fullName.trim(),
      data.age,
      data.address.trim(),
      data.rollNumber,
      data.courses.map((c: string) => c.trim().toUpperCase())
    );
    // Return validated user object
    return user;
  }
}
