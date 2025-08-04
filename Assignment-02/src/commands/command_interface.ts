import { UserRepository } from "../repositories/user-repository.js";
import { FileAdapter } from "../adapters/file-adapter.js";
import PromptSync from "prompt-sync";
import { sortUsers } from "../utils/sort-users.js";
import Table from "cli-table3";
import { UserValidator } from "../utils/validators/user-validator.js";

const prompt = PromptSync();

// interface for command execution
export interface Command {
  execute(): Promise<void> | void;
}

// concrete class for adding a user
export class AddUserCommand implements Command {
  execute(): void {
    const repo = UserRepository.getInstance();

    let fullName: string;
    while (true) {
      try {
        fullName = prompt("Enter user's full name: ");
        UserValidator.validateFullName(fullName);
        break;
      } catch (err: any) {
        console.log("Error:", err.message);
      }
    }

    let age: number;
    while (true) {
      try {
        const input = prompt("Enter user's age: ");
        age = parseInt(input, 10);
        UserValidator.validateAge(age);
        break;
      } catch (err: any) {
        console.log("Error:", err.message);
      }
    }

    let address: string;
    while (true) {
      try {
        address = prompt("Enter user's address: ");
        UserValidator.validateAddress(address);
        break;
      } catch (err: any) {
        console.log("Error:", err.message);
      }
    }

    let rollNumber: number;
    while (true) {
      try {
        const input = prompt("Enter user's roll number: ");
        rollNumber = parseInt(input, 10);
        UserValidator.validateRollNumber(rollNumber);
        UserValidator.ensureRollNumberIsUnique(rollNumber);
        break;
      } catch (err: any) {
        console.log("Error:", err.message);
      }
    }

    let courses: string[];
    while (true) {
      try {
        const input = prompt("Enter 4 courses (A-F) comma-separated: ");
        courses = input.split(",").map((c) => c.trim().toUpperCase());
        UserValidator.validateCourses(courses);
        break;
      } catch (err: any) {
        console.log("Error:", err.message);
      }
    }

    const newUser = {
      fullName,
      age,
      address,
      rollNumber,
      courses,
    };

    repo.addUser(newUser);
    console.log("User added successfully.");
  }
}

// concrete class for displaying users
export class DisplayUserCommand implements Command {
  execute(): void {
    const repo = UserRepository.getInstance();
    const users = repo.getUsers();

    if (users.length === 0) {
      console.log("No users to display.");
      return;
    }

    const table = new Table({
      head: ["Name", "Roll No", "Age", "Address", "Courses"],
      colWidths: [20, 10, 6, 20, 25],
      wordWrap: true,
      style: {
        head: ["cyan"],
        border: ["gray"],
      },
    });

    // Valid options
    const validFields = ["fullname", "rollnumber", "age", "address"];
    const validOrders = ["asc", "desc"];

    // Prompt and validate field
    let fieldInput: string;
    while (true) {
      fieldInput = prompt(
        "Sort by (fullName, rollNumber, age, address): "
      )?.toLowerCase();
      if (!fieldInput || !validFields.includes(fieldInput)) {
        console.log(
          "Invalid field. Choose from: fullName, rollNumber, age, address."
        );
        continue;
      }
      break;
    }

    // Prompt and validate order
    let orderInput: string;
    while (true) {
      orderInput = prompt("Order (asc/desc): ")?.toLowerCase();
      if (!orderInput || !validOrders.includes(orderInput)) {
        console.log("Invalid order. Choose 'asc' or 'desc'.");
        continue;
      }
      break;
    }

    const sorted = sortUsers(users, fieldInput as any, orderInput as any);
    sorted.forEach((u) => {
      table.push([
        u.fullName,
        u.rollNumber,
        u.age,
        u.address,
        u.courses.join(", "),
      ]);
    });

    console.log(table.toString());
  }
}

// concrete class for deleting a user
export class DeleteUserCommand implements Command {
  execute(): Promise<void> | void {
    const repo = UserRepository.getInstance();
    const roll = parseInt(prompt("Enter roll number to delete: "), 10);
    const result = repo.deleteUser(roll);
    console.log(result ? " User deleted." : " Roll number not found.");
  }
}

// concrete class for saving users
export class SaveUserCommand implements Command {
  execute(): Promise<void> | void {
    const repo = UserRepository.getInstance();
    const users = repo.getUsers();
    FileAdapter.save(users);
    console.log(" User data saved to disk.");
  }
}

// concrete class for exiting the CLI
export class ExitCommand implements Command {
  execute(): void {
    const save = prompt(
      "Do you want to save before exiting? (y/n): "
    ).toLowerCase();

    if (save === "y") {
      const repo = UserRepository.getInstance();
      const users = repo.getUsers();
      FileAdapter.save(users);
      console.log(" User data saved to disk.");
    }

    console.log(" Exiting CLI...");
    process.exit(0);
  }
}
