export interface Transaction {
    _id?: string;
    name: string;
    amount: number;
    date: Date;
    description?: string;
    personalBudget: string;
    category: string;
}
