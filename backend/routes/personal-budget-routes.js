import express from "express";

import {
    handleGetAllPersonalBudgets,
    handleGetPersonalBudgetById,
    handleCreatePersonalBudget,
    handleDeletePersonalBudget,
    handleUpdatePersonalBudget,
} from "../handlers/personal-budget-handler.js";

const router = express.Router();

router.route("/").get(handleGetAllPersonalBudgets);
router.route("/:id").get(handleGetPersonalBudgetById);
router.route("/").post(handleCreatePersonalBudget);
router.route("/:id").delete(handleDeletePersonalBudget);
router.route("/:id").put(handleUpdatePersonalBudget);

export default router;
