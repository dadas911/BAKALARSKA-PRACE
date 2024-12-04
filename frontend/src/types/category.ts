export interface Category {
    _id?: string;
    name: string;
    reductionRate: number;
    isGlobal: boolean;
    isExpense: boolean;
    familyBudget?: string;
}
