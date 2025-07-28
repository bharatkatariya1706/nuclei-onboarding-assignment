// simple user model class
export class User {
  constructor(
    public fullName: string,
    public age: number,
    public address: string,
    public rollNumber: number,
    public courses: string[]
  ) {}
}
