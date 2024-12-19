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

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Získá všechny notifikace uživatele
 *     tags: [Notifications]
 */
router.route("/").get(checkToken, handleGetAllUsersNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Získá notifikaci podle ID
 *     tags: [Notifications]
 */
router.route("/:id").get(checkToken, handleGetNotificationById);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Vytvoří novou notifikaci
 *     tags: [Notifications]
 */
router.route("/").post(checkToken, handleCreateNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Smaže notifikaci podle ID
 *     tags: [Notifications]
 */
router.route("/:id").delete(checkToken, handleDeleteNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Aktualizuje notifikaci podle ID
 *     tags: [Notifications]
 */
router.route("/:id").put(checkToken, handleUpdateNotification);

export default router;
