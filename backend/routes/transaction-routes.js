import express from "express";

import {
    handleGetAllTransactions,
    handleGetTransactionById,
    handleCreateTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
    handleGetTransactionsByMonth,
} from "../handlers/transaction-handler.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

/**
 * @swagger
 * /transactions/personal:
 *   post:
 *     summary: Získá seznam všech transakcí z určitého měsíce a roku
 *     tags: [Transactions]
 */
router.route("/personal").post(checkToken, handleGetTransactionsByMonth);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Získá seznam všech transakcí
 *     tags: [Transactions]
 */
router.route("/").get(checkToken, handleGetAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Získá transakci podle ID¨
 *     tags: [Transactions]
 */
router.route("/:id").get(checkToken, handleGetTransactionById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Vytvoří novou transakci
 *     tags: [Transactions]
 */
router.route("/").post(checkToken, handleCreateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Smaže transakci podle ID
 *     tags: [Transactions]
 */
router.route("/:id").delete(checkToken, handleDeleteTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Aktualizuje transakci podle ID
 *     tags: [Transactions]
 */
router.route("/:id").put(checkToken, handleUpdateTransaction);

export default router;
