export interface PersonalBudget {
    _id?: string;
    name: string;
    month: number;
    year: number;
    income: number;
    expectedIncome?: number;
    expense: number;
    spendings: string[];
    flexibility: number;
    weight: Record<string, number>;
    user?: string;
    transactions?: string[];
}
