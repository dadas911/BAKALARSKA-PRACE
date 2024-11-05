import mongoose from "mongoose";
import { BudgetModel } from "./budget-model.js";

const PersonalBudgetSchema = new mongoose.Schema({
    personalIncome: { type: Number, required: true },
    flexibility: { type: Number, required: true },
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
            default: null,
        },
    ],
});

export const PersonalBudgetModel = BudgetModel.discriminator(
    "PersonalBudget",
    PersonalBudgetSchema
);
