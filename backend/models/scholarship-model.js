import mongoose from "mongoose";

const ScholarshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    submissionDate: { type: Date, required: true },
    notifyDate: { type: Date, required: false },
    personalBudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonalBudget",
        required: true,
    },
});

export const ScholarshipModel = mongoose.model(
    "Scholarship",
    ScholarshipSchema
);
