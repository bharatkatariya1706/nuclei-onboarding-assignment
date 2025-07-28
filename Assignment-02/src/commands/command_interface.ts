import { UserRepository } from "../repositories/user-repository.js";
import { FileAdapter } from "../adapters/file-adapter.js";
import PromptSync from "prompt-sync";
import { sortUsers } from "../utils/sort-users.js";
import Table from "cli-table3";
import { UserFactory } from "../factories/user-factory.js";

const prompt = PromptSync();

// interface for command execution
export interface Command {
  execute(): Promise<void> | void;
}

// concrete class for adding a user 
export class AddUserCommand implements Command {
    execute(): void {
      try {
         const repo = UserRepository.getInstance();
        const fullName = prompt("Enter user's full name: ");
        const age = parseInt(prompt("Enter user's age: "), 10);
        const address = prompt("Enter user's address: ");
        const rollNumber = parseInt(prompt("Enter user's roll number: "), 10);
        const courses = prompt("Enter 4 courses (A-F) comma-separated: ")
          .split(",")
          .map((c) => c.trim().toUpperCase());
    
        const newUser = UserFactory.createUser({
          fullName,
          age,
          address,
          rollNumber,
          courses,
        });
    
        repo.addUser(newUser);
        console.log("✅ User added successfully.");
      } catch (error: any) {
        console.log("❌ Error:", error.message);
      }
    }
    
}

// concrete class for displaying users
export class DisplayUserCommmand implements Command {
    execute(): Promise<void> | void {
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
          const fieldInput = prompt(
            "Sort by (fullName, rollNumber, age, address): "
          ).toLowerCase();
          const orderInput = prompt("Order (asc/desc): ").toLowerCase();
          const validFields = ["fullname", "rollnumber", "age", "address"];
          const validOrders = ["asc", "desc"];
          const field = fieldInput;
          if (!validFields.includes(fieldInput) || !validOrders.includes(orderInput)) {
            console.log("❌ Invalid field or order.");
            return;
          }
          const sorted = sortUsers(users, field as any, orderInput as any);
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
export class DeleteUserCommand implements Command{
    execute(): Promise<void> | void {
            const repo = UserRepository.getInstance();
        const roll = parseInt(prompt("Enter roll number to delete: "), 10);
          const result = repo.deleteUser(roll);
          console.log(result ? "✅ User deleted." : "❌ Roll number not found.");
    }
}

// concrete class for saving users
export class SaveUserCommand implements Command{
    execute(): Promise<void> | void {
            const repo = UserRepository.getInstance();
         const users = repo.getUsers();
          FileAdapter.save(users);
          console.log("💾 User data saved to disk.");
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
      console.log("💾 User data saved to disk.");
    }

    console.log(" Exiting CLI...");
    process.exit(0); 
  }
}
