import express from "express";

import {
    handleGetAllAccounts,
    handleGetAccountById,
    handleCreateAccount,
    handleDeleteAccount,
    handleUpdateAccount,
    handleHasFamilyAccount,
} from "../handlers/family-account-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/check").get(checkToken, handleHasFamilyAccount);
router.route("/").get(checkToken, handleGetAllAccounts);
router.route("/:id").get(checkToken, handleGetAccountById);
router.route("/").post(checkToken, handleCreateAccount);
router.route("/:id").delete(checkToken, handleDeleteAccount);
router.route("/:id").put(checkToken, handleUpdateAccount);

export default router;
