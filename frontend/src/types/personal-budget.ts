export interface PersonalBudget {
    _id?: string;
    name: string;
    month: number;
    year: number;
    spendings: string[];
    personalIncome: number;
    flexibility: number;
    weight: Record<string, number>;
    user: string;
    transactions?: string[];
}
