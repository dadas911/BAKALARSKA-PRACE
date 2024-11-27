export interface Scholarship {
    _id?: string;
    name: string;
    amount: number;
    submissionDate: Date;
    notifyDate?: Date;
    personalBudget?: string;
}
