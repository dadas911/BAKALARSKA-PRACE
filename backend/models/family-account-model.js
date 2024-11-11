import mongoose from "mongoose";

const FamilyAccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    familyBudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyBudget",
        default: null,
    },
});

export const FamilyAccountModel = mongoose.model(
    "FamilyAccount",
    FamilyAccountSchema
);
