import mongoose from "mongoose";

const SpendingsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "Budget",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});

export const SpendingsModel = mongoose.model("Spendings", SpendingsSchema);
