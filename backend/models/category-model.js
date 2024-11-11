import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    isGlobal: { type: Boolean, default: false },
    familyBudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyBudget",
        default: null,
    },
});
export const CategoryModel = mongoose.model("Category", CategorySchema);
