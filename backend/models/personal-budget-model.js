import mongoose from "mongoose";
import { BudgetModel } from "./budget-model.js";

const PersonalBudgetSchema = new mongoose.Schema({
    expectedIncome: { type: Number, default: 0 },
    flexibility: { type: Number, default: 1 },
    weight: {
        type: Map,
        of: Number,
        default: {},
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            default: [],
        },
    ],
    scholarships: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scholarship",
            default: [],
        },
    ],
});

export const PersonalBudgetModel = BudgetModel.discriminator(
    "PersonalBudget",
    PersonalBudgetSchema
);
