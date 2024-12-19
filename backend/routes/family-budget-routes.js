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

/**
 * @swagger
 * /family-budgets/family:
 *   post:
 *     summary: Získá rodinný rozpočet podle měsíce a roku
 *     tags: [FamilyBudgets]
 */
router.route("/family").post(checkToken, handleGetFamilyBudgetByMonth);

/**
 * @swagger
 * /family-budgets:
 *   get:
 *     summary: Získá všechny rodinné rozpočty
 *     tags: [FamilyBudgets]
 */
router.route("/").get(checkToken, handleGetAllFamilyBudgets);

/**
 * @swagger
 * /family-budgets/{id}:
 *   get:
 *     summary: Získá rodinný rozpočet podle ID
 *     tags: [FamilyBudgets]
 */
router.route("/:id").get(checkToken, handleGetFamilyBudgetById);

/**
 * @swagger
 * /family-budgets:
 *   post:
 *     summary: Vytvoří nový rodinný rozpočet
 *     tags: [FamilyBudgets]
 */
router.route("/").post(checkToken, handleCreateFamilyBudget);

/**
 * @swagger
 * /family-budgets/{id}:
 *   delete:
 *     summary: Smaže rodinný rozpočet podle ID
 *     tags: [FamilyBudgets]
 */
router.route("/:id").delete(checkToken, handleDeleteFamilyBudget);

/**
 * @swagger
 * /family-budgets/{id}:
 *   put:
 *     summary: Aktualizuje rodinný rozpočet podle ID
 *     tags: [FamilyBudgets]
 */
router.route("/:id").put(checkToken, handleUpdateFamilyBudget);

export default router;
