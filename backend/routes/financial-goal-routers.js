import express from "express";

import {
    handleGetFinancialGoalById,
    handleGetPersonalFinancialGoals,
    handleGetFamilyFinancialGoals,
    handleCreateFinancialGoal,
    handleDeleteFinancialGoal,
    handleUpdateFinancialGoal,
} from "../handlers/financial-goal-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/personal").get(checkToken, handleGetPersonalFinancialGoals);
router.route("/family").get(checkToken, handleGetFamilyFinancialGoals);
router.route("/:id").get(checkToken, handleGetFinancialGoalById);
router.route("/").post(checkToken, handleCreateFinancialGoal);
router.route("/:id").delete(checkToken, handleDeleteFinancialGoal);
router.route("/:id").put(checkToken, handleUpdateFinancialGoal);

export default router;
