import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    spendings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Spendings",
            default: [],
        },
    ],
});

export const BudgetModel = mongoose.model("Budget", BudgetSchema);
