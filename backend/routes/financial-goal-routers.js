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

/**
 * @swagger
 * /financial-goals/personal:
 *   get:
 *     summary: Získá všechny osobní finanční cíle přihlášeného uživatele
 *     tags: [FinancialGoals]
 */
router.route("/personal").get(checkToken, handleGetPersonalFinancialGoals);

/**
 * @swagger
 * /financial-goals/family:
 *   get:
 *     summary: Získá všechny rodinné cíle přihlášeného uživatele
 *     tags: [FinancialGoals]
 */
router.route("/family").get(checkToken, handleGetFamilyFinancialGoals);

/**
 * @swagger
 * /financial-goals/{id}:
 *   get:
 *     summary: Získá finanční cíl podle ID
 *     tags: [FinancialGoals]
 */
router.route("/:id").get(checkToken, handleGetFinancialGoalById);

/**
 * @swagger
 * /financial-goals:
 *   post:
 *     summary: Vytvoří nový finanční cíl
 *     tags: [FinancialGoals]
 */
router.route("/").post(checkToken, handleCreateFinancialGoal);

/**
 * @swagger
 * /financial-goals/{id}:
 *   delete:
 *     summary: Smaže finanční cíl podle ID
 *     tags: [FinancialGoals]
 */
router.route("/:id").delete(checkToken, handleDeleteFinancialGoal);

/**
 * @swagger
 * /financial-goals/{id}:
 *   put:
 *     summary: Aktualizuje finanční cíl podle ID
 *     tags: [FinancialGoals]
 */
router.route("/:id").put(checkToken, handleUpdateFinancialGoal);

export default router;
