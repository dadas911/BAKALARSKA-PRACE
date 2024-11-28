import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
});
export const NotificationModel = mongoose.model(
    "Notification",
    NotificationSchema
);
