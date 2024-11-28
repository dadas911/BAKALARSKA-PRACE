import express from "express";

import {
    handleGetAllPersonalBudgets,
    handleGetPersonalBudgetById,
    handleCreatePersonalBudget,
    handleDeletePersonalBudget,
    handleUpdatePersonalBudget,
    handleGetPersonalBudgetByMonth,
    handleGetFamilyMemberBudgetByMonth,
} from "../handlers/personal-budget-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/personal").post(checkToken, handleGetPersonalBudgetByMonth);
router.route("/member").post(checkToken, handleGetFamilyMemberBudgetByMonth);
router.route("/").get(checkToken, handleGetAllPersonalBudgets);
router.route("/:id").get(checkToken, handleGetPersonalBudgetById);
router.route("/").post(checkToken, handleCreatePersonalBudget);
router.route("/:id").delete(checkToken, handleDeletePersonalBudget);
router.route("/:id").put(checkToken, handleUpdatePersonalBudget);

export default router;
