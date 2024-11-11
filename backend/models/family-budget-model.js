import mongoose from "mongoose";
import { BudgetModel } from "./budget-model.js";

const FamilyBudgetSchema = new mongoose.Schema({
    familyIncome: { type: Number, required: true },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyAccount",
        required: true,
    },
    categories: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        default: [],
    },
});

export const FamilyBudgetModel = BudgetModel.discriminator(
    "FamilyBudget",
    FamilyBudgetSchema
);
