export interface FamilyBudget {
    _id?: string;
    name: string;
    month: number;
    year: number;
    spendings: string[];
    familyIncome: number;
    account: string;
    categories: string[];
}
