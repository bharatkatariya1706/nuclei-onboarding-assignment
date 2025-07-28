import { describe, it, expect, beforeEach } from "vitest";
import { UserRepository } from "../src/repositories/user-repository";
import { User } from "../src/models/user";


describe("UserRepository", () => {
  let repo: UserRepository;

  const user1: User = {
    fullName: "Alice",
    age: 20,
    address: "Delhi",
    rollNumber: 101,
    courses: ["A", "B", "C", "D"],
  };

  const user2: User = {
    fullName: "Bob",
    age: 21,
    address: "Mumbai",
    rollNumber: 102,
    courses: ["A", "B", "C", "D"],
  };

  const sameNameUser: User = {
    fullName: "Alice",
    age: 22,
    address: "Bangalore",
    rollNumber: 100,
    courses: ["A", "B", "C", "D"],
  };

  beforeEach(() => {
    repo = UserRepository.getInstance();
    repo.setUsers([]); // reset before each test
  });

  it("should return the singleton instance", () => {
    const anotherInstance = UserRepository.getInstance();
    expect(repo).toBe(anotherInstance);
  });

  it("should add user and sort them", () => {
    repo.addUser(user1);
    repo.addUser(sameNameUser); // same name, lower roll number

    const users = repo.getUsers();
    expect(users.length).toBe(2);
    expect(users[0].rollNumber).toBe(100); // sorted by name then rollNumber
  });

  it("should delete user by roll number", () => {
    repo.addUser(user1);
    const deleted = repo.deleteUser(101);
    expect(deleted).toBe(true);
    expect(repo.getUsers().length).toBe(0);
  });

  it("should return false if user to delete does not exist", () => {
    const deleted = repo.deleteUser(999);
    expect(deleted).toBe(false);
  });

  it("should return a copy of users", () => {
    repo.addUser(user1);
    const users = repo.getUsers();
    users.push(user2); // modify copy
    expect(repo.getUsers().length).toBe(1); 
  });

  it("should replace all users with setUsers and sort", () => {
    repo.setUsers([user1, sameNameUser]);
    const users = repo.getUsers();
    expect(users[0].rollNumber).toBe(100); // lower rollNumber first
  });

  it("calls getUsers and returns expected data", () => {
    repo.addUser(user1);
    const users = repo.getUsers(); 
    expect(users.length).toBe(1);
    expect(users[0].fullName).toBe("Alice");
  });

  it("should clear all users", () => {
    repo.addUser(user1);
    expect(repo.getUsers().length).toBe(1);
    repo.clearUsers();
    expect(repo.getUsers().length).toBe(0);
  });
});
