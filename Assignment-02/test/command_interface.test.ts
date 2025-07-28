import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AddUserCommand,
  DisplayUserCommand,
  DeleteUserCommand,
  SaveUserCommand,
  ExitCommand,
} from "../src/commands/command_interface.js";
import { UserRepository } from "../src/repositories/user-repository.js";
import { FileAdapter } from "../src/adapters/file-adapter.js";
import Table from "cli-table3";
import { UserValidator } from "../src/utils/validators/user-validator.js";


const promptMock = (globalThis as any).promptMock;


vi.mock("../src/adapters/file-adapter.js", () => ({
  FileAdapter: {
    save: vi.fn(),
  },
}));

vi.mock("cli-table3", () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: () => "mocked table output",
  })),
}));


const mockUsers = [
  {
    fullName: "Alice",
    age: 20,
    address: "Delhi",
    rollNumber: 1,
    courses: ["A", "B", "C", "D"],
  },
];

vi.mock("../src/repositories/user-repository.js", async () => {
  return {
    UserRepository: {
      getInstance: () => ({
        getUsers: () => [...mockUsers],
        addUser: vi.fn(),
        deleteUser: vi.fn().mockReturnValue(true),
      }),
    },
  };
});

vi.mock("../src/utils/validators/user-validator.js", async () => {
  return {
    UserValidator: {
      validateFullName: vi.fn(),
      validateAge: vi.fn(),
      validateAddress: vi.fn(),
      validateRollNumber: vi.fn(),
      ensureRollNumberIsUnique: vi.fn(),
      validateCourses: vi.fn(),
    },
  };
});

describe("CLI Commands", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("AddUserCommand should add a user after valid inputs", () => {
    promptMock
      .mockReturnValueOnce("Alice") // fullName
      .mockReturnValueOnce("20") // age
      .mockReturnValueOnce("Delhi") // address
      .mockReturnValueOnce("1") // rollNumber
      .mockReturnValueOnce("A,B,C,D"); // courses

    const cmd = new AddUserCommand();
    cmd.execute();

    expect(promptMock).toHaveBeenCalledTimes(5);
  });


it("AddUserCommand should catch error when full name is invalid", () => {
  promptMock
    .mockReturnValueOnce("") // 1st fullName input (invalid)
    .mockReturnValueOnce("Alice") // 2nd fullName input (valid)
    .mockReturnValueOnce("20") // age
    .mockReturnValueOnce("Delhi") // address
    .mockReturnValueOnce("1") // rollNumber
    .mockReturnValueOnce("A,B,C,D"); // courses

  const validateFullNameSpy = vi.spyOn(UserValidator, "validateFullName");
  validateFullNameSpy
    .mockImplementationOnce(() => {
      throw new Error("Invalid full name");
    })
    .mockImplementationOnce(() => {}); // valid on 2nd try

  vi.spyOn(UserValidator, "validateAge").mockImplementation(() => {});
  vi.spyOn(UserValidator, "validateAddress").mockImplementation(() => {});
  vi.spyOn(UserValidator, "validateRollNumber").mockImplementation(() => {});
  vi.spyOn(UserValidator, "ensureRollNumberIsUnique").mockImplementation(
    () => {}
  );
  vi.spyOn(UserValidator, "validateCourses").mockImplementation(() => {});
  vi.spyOn(UserRepository.getInstance(), "addUser").mockImplementation(
    () => {}
  );

  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  const cmd = new AddUserCommand();
  cmd.execute();

  expect(logSpy).toHaveBeenCalledWith("Error:", "Invalid full name");
});



  it("AddUserCommand should catch error when address is invalid", () => {
    promptMock
      .mockReturnValueOnce("Alice") // fullName
      .mockReturnValueOnce("20") // age
      .mockReturnValueOnce("") // 1st try: invalid address
      .mockReturnValueOnce("Delhi") // 2nd try: valid address
      .mockReturnValueOnce("1") // rollNumber
      .mockReturnValueOnce("A,B,C,D"); // courses

    // mock validateAddress to throw first
    const validateAddressSpy = vi.spyOn(UserValidator, "validateAddress");
    validateAddressSpy
      .mockImplementationOnce(() => {
        throw new Error("Invalid address");
      })
      .mockImplementationOnce(() => {}); // pass on 2nd

    vi.spyOn(UserValidator, "validateFullName").mockImplementation(() => {});
    vi.spyOn(UserValidator, "validateAge").mockImplementation(() => {});
    vi.spyOn(UserValidator, "validateRollNumber").mockImplementation(() => {});
    vi.spyOn(UserValidator, "ensureRollNumberIsUnique").mockImplementation(
      () => {}
    );
    vi.spyOn(UserValidator, "validateCourses").mockImplementation(() => {});
    vi.spyOn(UserRepository.getInstance(), "addUser").mockImplementation(
      () => {}
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const cmd = new AddUserCommand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("Error:", "Invalid address");
  });

  it("AddUserCommand should catch error when age is invalid", () => {
    promptMock
      .mockReturnValueOnce("Alice") // fullName
      .mockReturnValueOnce("notANumber") // 1st age 
      .mockReturnValueOnce("20") // 2nd age 
      .mockReturnValueOnce("Delhi") // address
      .mockReturnValueOnce("1") // rollNumber
      .mockReturnValueOnce("A,B,C,D"); // courses

    vi.spyOn(UserValidator, "validateFullName").mockImplementation(() => {});
    const validateAgeSpy = vi.spyOn(UserValidator, "validateAge");
    validateAgeSpy
      .mockImplementationOnce(() => {
        throw new Error("Invalid age");
      })
      .mockImplementationOnce(() => {}); // pass on 2nd

    vi.spyOn(UserValidator, "validateAddress").mockImplementation(() => {});
    vi.spyOn(UserValidator, "validateRollNumber").mockImplementation(() => {});
    vi.spyOn(UserValidator, "ensureRollNumberIsUnique").mockImplementation(
      () => {}
    );
    vi.spyOn(UserValidator, "validateCourses").mockImplementation(() => {});
    vi.spyOn(UserRepository.getInstance(), "addUser").mockImplementation(
      () => {}
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const cmd = new AddUserCommand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("Error:", "Invalid age");
  });


  it("AddUserCommand should catch error when roll number is not unique", () => {
    promptMock
      .mockReturnValueOnce("Alice") // fullName
      .mockReturnValueOnce("20") // age
      .mockReturnValueOnce("Delhi") // address
      .mockReturnValueOnce("1") // 1st rollNumber 
      .mockReturnValueOnce("2") // 2nd rollNumber 
      .mockReturnValueOnce("A,B,C,D"); // courses

    vi.spyOn(UserValidator, "validateFullName").mockImplementation(() => {});
    vi.spyOn(UserValidator, "validateAge").mockImplementation(() => {});
    vi.spyOn(UserValidator, "validateAddress").mockImplementation(() => {});
    vi.spyOn(UserValidator, "validateRollNumber").mockImplementation(() => {});

    const ensureUniqueSpy = vi.spyOn(UserValidator, "ensureRollNumberIsUnique");
    ensureUniqueSpy
      .mockImplementationOnce(() => {
        throw new Error("Roll number already exists");
      })
      .mockImplementationOnce(() => {}); 

    vi.spyOn(UserValidator, "validateCourses").mockImplementation(() => {});
    vi.spyOn(UserRepository.getInstance(), "addUser").mockImplementation(
      () => {}
    );
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const cmd = new AddUserCommand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("Error:", "Roll number already exists");
  });


  it("AddUserCommand should catch error when invalid courses are entered", () => {
    promptMock
      .mockReturnValueOnce("Alice") // fullName
      .mockReturnValueOnce("20") // age
      .mockReturnValueOnce("Delhi") // address
      .mockReturnValueOnce("1") // rollNumber
      .mockReturnValueOnce("Z,Y,X,W") // invalid courses 
      .mockReturnValueOnce("A,B,C,D"); // valid courses 

    const validateCoursesMock = vi.spyOn(UserValidator, "validateCourses");
    validateCoursesMock
      .mockImplementationOnce(() => {
        throw new Error("Invalid courses");
      })
      .mockImplementationOnce(() => {}); // success

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const cmd = new AddUserCommand();
    cmd.execute();

    expect(logSpy).toHaveBeenCalledWith("Error:", "Invalid courses");
  });



  it("DisplayUserCommmand should display sorted users", () => {
    promptMock.mockReturnValueOnce("fullname").mockReturnValueOnce("asc");
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const cmd = new DisplayUserCommand();
    cmd.execute();
    expect(logSpy).toHaveBeenCalledWith("mocked table output");
  });

  it("DisplayUserCommmand should prompt again on invalid field and order", () => {
    promptMock
      .mockReturnValueOnce("wrong") // invalid 
      .mockReturnValueOnce("fullname") // valid 
      .mockReturnValueOnce("wrong") // invalid 
      .mockReturnValueOnce("asc"); // valid 

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const cmd = new DisplayUserCommand();
    cmd.execute();
    expect(logSpy).toHaveBeenCalledWith(
      "Invalid field. Choose from: fullName, rollNumber, age, address."
    );
    expect(logSpy).toHaveBeenCalledWith(
      "Invalid order. Choose 'asc' or 'desc'."
    );
  });
  
it("DisplayUserCommand should log message when no users exist", () => {
  // Spy on UserRepository.getInstance and mock its return value
  const repoMock = {
    getUsers: () => [],
  };

  const getInstanceSpy = vi
    .spyOn(UserRepository, "getInstance")
    .mockReturnValue(repoMock as any);

  // Spy on console.log to track output
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  const cmd = new DisplayUserCommand();
  cmd.execute();

  expect(logSpy).toHaveBeenCalledWith("No users to display.");

  // Restore mocks after test 
  getInstanceSpy.mockRestore();
  logSpy.mockRestore();
});


 it("DeleteUserCommand should delete user", () => {
   // Mock prompt to return "1" when called
   promptMock.mockReturnValueOnce("1");

   // Spy console.log so we can check what is printed
   const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});


   const repoMock = {
     deleteUser: vi.fn().mockReturnValue(true),
   };

   // Spy on UserRepository.getInstance to return our mocked repo
   const getInstanceSpy = vi
     .spyOn(UserRepository, "getInstance")
     .mockReturnValue(repoMock as any);

   const cmd = new DeleteUserCommand();
   cmd.execute();

   expect(logSpy).toHaveBeenCalledWith(" User deleted.");

   // Restore mocks
   getInstanceSpy.mockRestore();
   logSpy.mockRestore();
 });


  it("SaveUserCommand should save users", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const cmd = new SaveUserCommand();
    cmd.execute();
    expect(FileAdapter.save).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(" User data saved to disk.");
  });

  it("ExitCommand should save and exit if user agrees", () => {
    promptMock.mockReturnValueOnce("y");
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit"); 
    });

    try {
      const cmd = new ExitCommand();
      cmd.execute();
    } catch (_) {}

    expect(FileAdapter.save).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(" User data saved to disk.");
    expect(logSpy).toHaveBeenCalledWith(" Exiting CLI...");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("ExitCommand should not save if user declines", () => {
    promptMock.mockReturnValueOnce("n");
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit");
    });

    try {
      const cmd = new ExitCommand();
      cmd.execute();
    } catch (_) {}

    expect(FileAdapter.save).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(" Exiting CLI...");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
