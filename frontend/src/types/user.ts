export interface User {
    _id?: string;
    username: string;
    firstName: string;
    secondName: string;
    password: string;
    email: string;
    role: "živitel" | "člen domácnosti" | "student" | "senior";
    familyAccount?: string | null;
    personalBudget?: string | null;
}
