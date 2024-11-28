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
} from "../handlers/spendings-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/personal").post(checkToken, handleGetPersonalSpendingsByMonth);
router.route("/family").post(checkToken, handleGetFamilySpendingsByMonth);
router.route("/member").post(checkToken, handleGetFamilyMemberSpendingsByMonth);
router.route("/").get(checkToken, handleGetAllSpendings);
router.route("/:id").get(checkToken, handleGetSpendingsById);
router.route("/").post(checkToken, handleCreateSpendings);
router.route("/:id").delete(checkToken, handleDeleteSpendings);
router.route("/:id").put(checkToken, handleUpdateSpendings);

export default router;
