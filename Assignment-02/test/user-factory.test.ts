import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserFactory } from "../src/factories/user-factory";
import { UserValidator } from "../src/utils/validators/user-validator";

// Mock UserValidator to isolate test to UserFactory
vi.mock("../src/utils/validators/user-validator", () => ({
  UserValidator: {
    validate: vi.fn(),
  },
}));

describe("UserFactory", () => {

  const validUserData = {
    fullName: "    Bharat Katariya  ",
    age: 25,
    address: "indore india ",
    rollNumber: 101,
    courses: ["a", "b", "c", "d"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call UserValidator.validate and return a formatted user object", () => {
    const user = UserFactory.createUser(validUserData);

    // Assert validator was called with original input
    expect(UserValidator.validate).toHaveBeenCalledWith(validUserData);

    // Assert returned user object 
    expect(user).toEqual({
      fullName: "Bharat Katariya",
      age: 25,
      address: "indore india",
      rollNumber: 101,
      courses: ["A", "B", "C", "D"],
    });
  });
});
