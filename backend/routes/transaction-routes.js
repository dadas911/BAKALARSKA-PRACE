import express from "express";

import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateTransaction,
} from "../controllers/transaction-controller.js";

const router = express.Router();

router.route("/").get(getAllTransactions);
router.route("/:id").get(getTransactionById);
router.route("/").post(createTransaction);
router.route("/:id").delete(deleteTransaction);
router.route("/:id").put(updateTransaction);

export default router;
