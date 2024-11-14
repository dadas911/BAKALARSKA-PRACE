export interface Category {
    _id?: string;
    name: string;
    isGlobal: boolean;
    isExpense: boolean;
    familyBudget?: string;
}
