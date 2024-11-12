import express from "express";

import {
    handleGetAllTransactions,
    handleGetTransactionById,
    handleCreateTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
} from "../handlers/transaction-handler.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/").get(checkToken, handleGetAllTransactions);
router.route("/:id").get(checkToken, handleGetTransactionById);
router.route("/").post(checkToken, handleCreateTransaction);
router.route("/:id").delete(checkToken, handleDeleteTransaction);
router.route("/:id").put(checkToken, handleUpdateTransaction);

export default router;
