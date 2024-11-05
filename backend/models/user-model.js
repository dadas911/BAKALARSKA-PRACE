import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, "Prosím, zadejte platnou e-mailovou adresu"],
    },
    role: {
        type: String,
        required: true,
        enum: ["živitel", "člen domácnosti", "student", "senior"],
    },
    familyAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyAccount",
        default: null,
    },
    personalBudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonalBudget",
        default: null,
    },
});

export const UserModel = mongoose.model("User", UserSchema);
