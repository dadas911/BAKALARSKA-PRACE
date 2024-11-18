export interface FamilyAccount {
    _id?: string;
    name: string;
    owner?: string;
    users?: string[];
    familyBudget?: string | null;
}
