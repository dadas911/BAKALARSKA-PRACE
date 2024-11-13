import express from "express";

import {
    handleGetAllPersonalBudgets,
    handleGetPersonalBudgetById,
    handleCreatePersonalBudget,
    handleDeletePersonalBudget,
    handleUpdatePersonalBudget,
    handleGetPersonalBudgetBalance,
} from "../handlers/personal-budget-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/balance").get(checkToken, handleGetPersonalBudgetBalance);
router.route("/").get(checkToken, handleGetAllPersonalBudgets);
router.route("/:id").get(checkToken, handleGetPersonalBudgetById);
router.route("/").post(checkToken, handleCreatePersonalBudget);
router.route("/:id").delete(checkToken, handleDeletePersonalBudget);
router.route("/:id").put(checkToken, handleUpdatePersonalBudget);

export default router;
