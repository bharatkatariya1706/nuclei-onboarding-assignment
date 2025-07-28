import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AddUserCommand,
  DisplayUserCommmand,
  DeleteUserCommand,
  SaveUserCommand,
  ExitCommand,
} from "../src/commands/command_interface.js";
import { UserRepository } from "../src/repositories/user-repository.js";
import { FileAdapter } from "../src/adapters/file-adapter.js";

// mock prompt-sync globally
const promptMock = (globalThis as any).promptMock;

// mock Table (cli-table3)
const tablePushMock = vi.fn();
const tableToStringMock = vi.fn(() => "mock-table-output");
vi.mock("cli-table3", () => {
  return {
    default: vi.fn(() => ({
      push: tablePushMock,
      toString: tableToStringMock,
    })),
  };
});

// mock sortUsers
vi.mock("../src/utils/sort-users.js", () => ({
  sortUsers: vi.fn((users) => users),
}));

// mock UserFactory
vi.mock("../src/factories/user-factory.js", () => ({
  UserFactory: {
    createUser: vi.fn((data) => data),
  },
}));

vi.mock("../src/adapters/file-adapter.js");

describe("Command Interface Classes", () => {
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  let repo: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    promptMock.mockReset();
    logSpy.mockClear();

    repo = UserRepository.getInstance();
    repo.clearUsers();
  });

  it("AddUserCommand should add user correctly", () => {
    promptMock
      .mockReturnValueOnce("John Doe")
      .mockReturnValueOnce("25")
      .mockReturnValueOnce("Delhi")
      .mockReturnValueOnce("101")
      .mockReturnValueOnce("A,B,C,D");

    const cmd = new AddUserCommand();
    cmd.execute();

    expect(repo.getUsers().length).toBe(1);
    expect(logSpy).toHaveBeenCalledWith("✅ User added successfully.");
  });

  it("DisplayUserCommmand should show sorted table when valid input", () => {
    repo.setUsers([
      {
        fullName: "Amit",
        age: 22,
        address: "Indore",
        rollNumber: 1,
        courses: ["A", "B"],
      },
    ]);

    promptMock.mockReturnValueOnce("fullname").mockReturnValueOnce("asc");

    const cmd = new DisplayUserCommmand();
    cmd.execute();

    expect(tablePushMock).toHaveBeenCalled();
    expect(tableToStringMock).toHaveBeenCalled();
  });

  it("should handle invalid sort inputs", () => {
   
    repo.setUsers([
      {
        fullName: "Test User",
        age: 20,
        address: "City",
        rollNumber: 1,
        courses: ["A", "B"],
      },
    ]);

    promptMock.mockReturnValueOnce("invalid").mockReturnValueOnce("desc");

    const cmd = new DisplayUserCommmand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("❌ Invalid field or order.");
  });

  it("DisplayUserCommmand should handle no users", () => {
    const cmd = new DisplayUserCommmand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("No users to display.");
  });

  it("DeleteUserCommand should delete existing user", () => {
    repo.setUsers([
      {
        fullName: "Amit",
        age: 22,
        address: "Indore",
        rollNumber: 101,
        courses: ["A"],
      },
    ]);

    promptMock.mockReturnValueOnce("101");

    const cmd = new DeleteUserCommand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("✅ User deleted.");
    expect(repo.getUsers().length).toBe(0);
  });

  it("DeleteUserCommand should show error for non-existent roll number", () => {
    promptMock.mockReturnValueOnce("999");

    const cmd = new DeleteUserCommand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("❌ Roll number not found.");
  });

  it("SaveUserCommand should save users", () => {
    const cmd = new SaveUserCommand();
    cmd.execute();

    expect(FileAdapter.save).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("💾 User data saved to disk.");
  });

  it("ExitCommand should save and exit if user chooses 'y'", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit called");
    });

    promptMock.mockReturnValueOnce("y");

    try {
      new ExitCommand().execute();
    } catch (e) {
      expect(FileAdapter.save).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith("💾 User data saved to disk.");
      expect(logSpy).toHaveBeenCalledWith(" Exiting CLI...");
      expect(exitSpy).toHaveBeenCalledWith(0);
    }
  });

  it("ExitCommand should not save if user chooses 'n'", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit called");
    });

    promptMock.mockReturnValueOnce("n");

    try {
      new ExitCommand().execute();
    } catch (e) {
      expect(FileAdapter.save).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(" Exiting CLI...");
      expect(exitSpy).toHaveBeenCalledWith(0);
    }
  });
});
