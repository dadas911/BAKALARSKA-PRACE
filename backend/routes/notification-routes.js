import express from "express";
import {
    handleGetAllUsersNotification,
    handleGetNotificationById,
    handleCreateNotification,
    handleDeleteNotification,
    handleUpdateNotification,
} from "../handlers/notification-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/").get(checkToken, handleGetAllUsersNotification);
router.route("/:id").get(checkToken, handleGetNotificationById);
router.route("/").post(checkToken, handleCreateNotification);
router.route("/:id").delete(checkToken, handleDeleteNotification);
router.route("/:id").put(checkToken, handleUpdateNotification);

export default router;
