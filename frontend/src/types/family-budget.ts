export interface FamilyBudget {
    _id?: string;
    name: string;
    month: number;
    year: number;
    income: number;
    expense: number;
    spendings?: string[];
    account?: string;
    categories?: string[];
}
