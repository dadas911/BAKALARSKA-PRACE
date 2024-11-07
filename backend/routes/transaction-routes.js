import express from "express";

import {
    handleGetAllTransactions,
    handleGetTransactionById,
    handleCreateTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
} from "../handlers/transaction-handler.js";

const router = express.Router();

router.route("/").get(handleGetAllTransactions);
router.route("/:id").get(handleGetTransactionById);
router.route("/").post(handleCreateTransaction);
router.route("/:id").delete(handleDeleteTransaction);
router.route("/:id").put(handleUpdateTransaction);

export default router;
