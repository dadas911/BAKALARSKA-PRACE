import express from "express";

import {
    handleGetAllSpendings,
    handleGetSpendingsById,
    handleCreateSpendings,
    handleDeleteSpendings,
    handleUpdateSpendings,
    handleGetPersonalSpendingsByMonth,
    handleGetFamilySpendingsByMonth,
    handleGetFamilyMemberSpendingsByMonth,
    handleCreateSmartSpendings,
} from "../handlers/spendings-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

/**
 * @swagger
 * /spendings/personal:
 *   post:
 *     summary: Získá spendings přihlášeného uživatele podle měsíce a roka
 *     tags: [Spendings]
 */
router.route("/personal").post(checkToken, handleGetPersonalSpendingsByMonth);

/**
 * @swagger
 * /spendings/family:
 *   post:
 *     summary: Získá spendings rodinného rozpočtu podle měsíce a roka
 *     tags: [Spendings]
 */
router.route("/family").post(checkToken, handleGetFamilySpendingsByMonth);

/**
 * @swagger
 * /spendings/member:
 *   post:
 *     summary: Získá spendings člena rodiny podle měsíce a roka
 *     tags: [Spendings]
 */
router.route("/member").post(checkToken, handleGetFamilyMemberSpendingsByMonth);

/**
 * @swagger
 * /spendings/smart:
 *   post:
 *     summary: Vytvoří rodinné i osobní spendings podle chytrého vzorce
 *     tags: [Spendings]
 */
router.route("/smart").post(checkToken, handleCreateSmartSpendings);

/**
 * @swagger
 * /spendings:
 *   get:
 *     summary: Získá všechny spendings
 *     tags: [Spendings]
 */
router.route("/").get(checkToken, handleGetAllSpendings);

/**
 * @swagger
 * /spendings/{id}:
 *   get:
 *     summary: Získá spending podle ID
 *     tags: [Spendings]
 */
router.route("/:id").get(checkToken, handleGetSpendingsById);

/**
 * @swagger
 * /spendings:
 *   post:
 *     summary: Vytvoří nový spending
 *     tags: [Spendings]
 */
router.route("/").post(checkToken, handleCreateSpendings);

/**
 * @swagger
 * /spendings/{id}:
 *   delete:
 *     summary: Smaže spending podle ID
 *     tags: [Spendings]
 */
router.route("/:id").delete(checkToken, handleDeleteSpendings);

/**
 * @swagger
 * /spendings/{id}:
 *   put:
 *     summary: Aktualizuje spending podle ID
 *     tags: [Spendings]
 */
router.route("/:id").put(checkToken, handleUpdateSpendings);

export default router;
