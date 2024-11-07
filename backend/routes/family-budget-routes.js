import express from "express";

import {
    handleGetAllFamilyBudgets,
    handleGetFamilyBudgetById,
    handleCreateFamilyBudget,
    handleDeleteFamilyBudget,
    handleUpdateFamilyBudget,
} from "../handlers/family-budget-handler.js";
const router = express.Router();

router.route("/").get(handleGetAllFamilyBudgets);
router.route("/:id").get(handleGetFamilyBudgetById);
router.route("/").post(handleCreateFamilyBudget);
router.route("/:id").delete(handleDeleteFamilyBudget);
router.route("/:id").put(handleUpdateFamilyBudget);

export default router;
