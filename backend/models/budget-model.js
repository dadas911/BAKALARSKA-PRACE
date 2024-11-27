import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    income: { type: Number, default: 0 },
    expense: { type: Number, default: 0 },
    spendings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Spendings",
            default: [],
        },
    ],
    financialGoals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FinancialGoal",
            default: [],
        },
    ],
});

export const BudgetModel = mongoose.model("Budget", BudgetSchema);
