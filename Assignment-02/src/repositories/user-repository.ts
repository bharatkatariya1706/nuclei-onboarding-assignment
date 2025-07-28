import { User } from "../models/user.js";

// Singleton Repository to store and manage users in memory
export class UserRepository {
  private static instance: UserRepository;
  private users: User[] = [];

  private constructor() {}

  // Get the single shared instance
  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  // Add new user and keep it sorted
  public addUser(user: User): void {
    this.users.push(user);
    this.sortUsers();
  }

  // Delete user by roll number
  public deleteUser(rollNumber: number): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.rollNumber !== rollNumber);
    return this.users.length < initialLength;
  }

  // Get copy of all users
  public getUsers(): User[] {
    return [...this.users]; // Return users as new array to prevent any external modifications
  }

  // Replace all users (used when loading from file)
  public setUsers(users: User[]): void {
    this.users = users;
    this.sortUsers();
  }

  // Sort users: first by full name, then by roll number
  private sortUsers(): void {
    this.users.sort((a, b) => {
      const nameComparison = a.fullName.localeCompare(b.fullName);
      return nameComparison !== 0
        ? nameComparison
        : a.rollNumber - b.rollNumber; // if names are exactly the same, sort by roll number
    });
  }
  public clearUsers(): void {
    this.users = [];
  }
}
