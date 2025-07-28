import { writeFileSync, readFileSync, existsSync } from "fs";
import { User } from "../models/user.js";

export class FileAdapter {
  private static readonly FILE_PATH = "./data/users.txt";

  //this method saves the users to a file
  public static save(users: User[]): void {
    const jsonData = JSON.stringify(users, null, 2); 
    writeFileSync(FileAdapter.FILE_PATH, jsonData, "utf-8");
  }

  //this method loads the users from a file
  public static load(): User[] {
    if (!existsSync(this.FILE_PATH)) return [];

    try {
      const fileData = readFileSync(this.FILE_PATH, "utf-8");

      // If file is empty or whitespace, treat as empty list
      if (!fileData.trim()) return [];

      return JSON.parse(fileData) as User[];
    } catch (error) {
      console.error(" Error reading users.txt: ", error);
      return [];
    }
  }
}
