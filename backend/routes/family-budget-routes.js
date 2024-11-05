import express from "express";

import {
    getAllFamilyBudgets,
    getFamilyBudgetById,
    createFamilyBudget,
    deleteFamilyBudget,
    updateFamilyBudget,
} from "../controllers/family-budget-controller.js";

const router = express.Router();

router.route("/").get(getAllFamilyBudgets);
router.route("/:id").get(getFamilyBudgetById);
router.route("/").post(createFamilyBudget);
router.route("/:id").delete(deleteFamilyBudget);
router.route("/:id").put(updateFamilyBudget);

export default router;
