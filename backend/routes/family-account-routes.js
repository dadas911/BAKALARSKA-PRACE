import express from "express";

import {
    getAllAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount,
} from "../controllers/family-account-controller.js";

const router = express.Router();

router.route("/").get(getAllAccounts);
router.route("/:id").get(getAccountById);
router.route("/").post(createAccount);
router.route("/:id").delete(deleteAccount);
router.route("/:id").put(updateAccount);

export default router;
