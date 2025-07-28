import PromptSync from "prompt-sync";
import { UserRepository } from "../repositories/user-repository.js";
import { FileAdapter } from "../adapters/file-adapter.js";
import * as UserCommands from "../commands/command_interface.js";

// Synchronous CLI input
const prompt = PromptSync();

export class CLI {
  private repo = UserRepository.getInstance();
  private commands: Record<string, UserCommands.Command>;

  constructor() {
    //  Load users once at startup
    const loadedUsers = FileAdapter.load();
    this.repo.setUsers(loadedUsers);
    console.log(`Loaded ${loadedUsers.length} users from disk.`);

    this.commands = {
      "1": new UserCommands.AddUserCommand(),
      "2": new UserCommands.DisplayUserCommand(),
      "3": new UserCommands.DeleteUserCommand(),
      "4": new UserCommands.SaveUserCommand(),
      "5": new UserCommands.ExitCommand(),
    };
  }

  public async run(): Promise<void> {
    while (true) {
      console.log(`
Menu:
1.  Add User
2.  Display Users
3.  Delete User
4.  Save Users
5.  Exit`);

      const choice = prompt("Enter your choice: ").trim();
      const command = this.commands[choice];

      if (command) {
        await command.execute(); 
      } else {
        console.log("Invalid option. Please choose 1-5.");
      }
    }
  }
}
