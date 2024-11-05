import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
    personalBudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonalBudget",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});

export const TransactionModel = mongoose.model(
    "Transaction",
    TransactionSchema
);
