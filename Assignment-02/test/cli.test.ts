import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CLI } from "../src/cli/cli.js";
import { FileAdapter } from "../src/adapters/file-adapter.js";
import { UserRepository } from "../src/repositories/user-repository.js";
import * as UserCommands from "../src/commands/command_interface.js";

// Mock prompt-sync to simulate user input
const promptMock = (globalThis as any).promptMock;

// Mock command classes with execute() methods
class MockCommand {
  execute = vi.fn().mockResolvedValue(undefined);
}

describe("CLI", () => {
  let logSpy: any;
  let originalConsoleLog: typeof console.log;

  let commandInstances: Record<string, MockCommand>;

  beforeEach(() => {
    
    originalConsoleLog = console.log;
    logSpy = vi.fn();
    console.log = logSpy;

    // Mock FileAdapter.load 
    vi.spyOn(FileAdapter, "load").mockReturnValue([
      { fullName: "Alice", rollNumber: 1, age: 20, address: "City", courses: ["A", "B", "C","D"] },
    ]);

    // Spy on repo.setUsers to verify it's called
    vi.spyOn(UserRepository.getInstance(), "setUsers");

    // Setup all mock command instances
    commandInstances = {
      AddUserCommand: new MockCommand(),
      DisplayUserCommand: new MockCommand(),
      DeleteUserCommand: new MockCommand(),
      SaveUserCommand: new MockCommand(),
      ExitCommand: new MockCommand(),
    };

    // Mock command constructors to return instances above
    vi.spyOn(UserCommands, "AddUserCommand").mockImplementation(
      () => commandInstances.AddUserCommand
    );
    vi.spyOn(UserCommands, "DisplayUserCommand").mockImplementation(
      () => commandInstances.DisplayUserCommand
    );
    vi.spyOn(UserCommands, "DeleteUserCommand").mockImplementation(
      () => commandInstances.DeleteUserCommand
    );
    vi.spyOn(UserCommands, "SaveUserCommand").mockImplementation(
      () => commandInstances.SaveUserCommand
    );
    vi.spyOn(UserCommands, "ExitCommand").mockImplementation(
      () => commandInstances.ExitCommand
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    console.log = originalConsoleLog;
  });

  it("should load users and set them in repository on CLI startup", () => {
    new CLI(); // constructor
    expect(FileAdapter.load).toHaveBeenCalled();
    expect(UserRepository.getInstance().setUsers).toHaveBeenCalledWith([
      {
        fullName: "Alice",
        rollNumber: 1,
        age: 20,
        address: "City",
        courses: ["A", "B", "C", "D"],
      },
    ]);
    expect(logSpy).toHaveBeenCalledWith("Loaded 1 users from disk.");
  });

  it("should execute all valid commands in order", async () => {
    // Simulate choices 1-5 in sequence
    promptMock
      .mockReturnValueOnce("1")
      .mockReturnValueOnce("2")
      .mockReturnValueOnce("3")
      .mockReturnValueOnce("4")
      .mockReturnValueOnce("5");

    const cli = new CLI();

    
    commandInstances.ExitCommand.execute.mockImplementationOnce(() => {
      throw new Error("exit");
    });

    try {
      await cli.run();
    } catch (_) {}

    expect(commandInstances.AddUserCommand.execute).toHaveBeenCalled();
    expect(commandInstances.DisplayUserCommand.execute).toHaveBeenCalled();
    expect(commandInstances.DeleteUserCommand.execute).toHaveBeenCalled();
    expect(commandInstances.SaveUserCommand.execute).toHaveBeenCalled();
    expect(commandInstances.ExitCommand.execute).toHaveBeenCalled();
  });

  it("should handle invalid input and prompt again", async () => {
    promptMock.mockReturnValueOnce("invalid").mockReturnValueOnce("5"); // Exit

    const cli = new CLI();
    commandInstances.ExitCommand.execute.mockImplementationOnce(() => {
      throw new Error("exit");
    });

    try {
      await cli.run();
    } catch (_) {}

    expect(logSpy).toHaveBeenCalledWith("Invalid option. Please choose 1-5.");
    expect(commandInstances.ExitCommand.execute).toHaveBeenCalled();
  });
});
