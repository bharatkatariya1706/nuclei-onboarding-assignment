import { User } from "../models/user";

type SortOrder = "asc" | "desc";
type SortField = "fullname" | "age" | "address" | "rollnumber";

export function sortUsers(users:User[] , sortUsersBy: SortField, order: SortOrder){

    // Validate input
    if (!Array.isArray(users) || users.length === 0) {
        throw new Error("Invalid or empty user list provided for sorting.");
    }
    
    const sorted = [...users];
    // Sort the users based on the specified field and order
    sorted.sort((a,b)=>{
        let a_value : string |number;
        let b_value : string | number;

        switch(sortUsersBy) {
            case "fullname":
                a_value = a.fullName.toLowerCase();
                b_value = b.fullName.toLowerCase();
                break;
            case "age":
                a_value = a.age;
                b_value = b.age;
                break;
            case "address":
                a_value = a.address.toLowerCase();
                b_value = b.address.toLowerCase();
                break;
            case "rollnumber":
                a_value = a.rollNumber;
                b_value = b.rollNumber;
                break;
            default : 
                throw new Error("Invalid sort field");
        }
         if (a_value < b_value) return order === "asc" ? -1 : 1;
         if (a_value > b_value) return order === "asc" ? 1 : -1;
         return 0;

    });
    return sorted;
}