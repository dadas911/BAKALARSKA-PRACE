import mongoose from "mongoose";

const FinancialGoalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    neededAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "Budget",
    },
});

export const FinancialGoalModel = mongoose.model(
    "FinancialGoal",
    FinancialGoalSchema
);
