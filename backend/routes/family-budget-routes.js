import express from "express";

import {
    handleGetAllFamilyBudgets,
    handleGetFamilyBudgetById,
    handleCreateFamilyBudget,
    handleDeleteFamilyBudget,
    handleUpdateFamilyBudget,
    handleGetFamilyBudgetByMonth,
    handleHasFamilyBudget,
} from "../handlers/family-budget-handler.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/family").post(checkToken, handleGetFamilyBudgetByMonth);
router.route("/").get(checkToken, handleGetAllFamilyBudgets);
router.route("/:id").get(checkToken, handleGetFamilyBudgetById);
router.route("/").post(checkToken, handleCreateFamilyBudget);
router.route("/:id").delete(checkToken, handleDeleteFamilyBudget);
router.route("/:id").put(checkToken, handleUpdateFamilyBudget);

export default router;
