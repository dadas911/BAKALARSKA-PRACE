export interface FinancialGoal {
    _id?: string;
    name: string;
    neededAmount: number;
    currentAmount: number;
    dueDate: Date;
    budget?: string;
}
