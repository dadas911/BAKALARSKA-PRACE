import express from "express";

import {
    handleGetAllAccounts,
    handleGetAccountById,
    handleCreateAccount,
    handleDeleteAccount,
    handleUpdateAccount,
} from "../handlers/family-account-handler.js";

const router = express.Router();

router.route("/").get(handleGetAllAccounts);
router.route("/:id").get(handleGetAccountById);
router.route("/").post(handleCreateAccount);
router.route("/:id").delete(handleDeleteAccount);
router.route("/:id").put(handleUpdateAccount);

export default router;
