import express from "express";

import {
    getAllPersonalBudgets,
    getPersonalBudgetById,
    createPersonalBudget,
    deletePersonalBudget,
    updatePersonalBudget,
} from "../controllers/personal-budget-controller.js";

const router = express.Router();

router.route("/").get(getAllPersonalBudgets);
router.route("/:id").get(getPersonalBudgetById);
router.route("/").post(createPersonalBudget);
router.route("/:id").delete(deletePersonalBudget);
router.route("/:id").put(updatePersonalBudget);

export default router;
