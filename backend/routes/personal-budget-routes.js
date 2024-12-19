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

/**
 * @swagger
 * /personal-budgets/personal:
 *   post:
 *     summary: Získá osobní rozpočet podle měsíce a roku
 *     tags: [PersonalBudgets]
 */
router.route("/personal").post(checkToken, handleGetPersonalBudgetByMonth);

/**
 * @swagger
 * /personal-budgets/member:
 *   post:
 *     summary: Získá rozpočet člena rodiny podle měsíce a roku
 *     tags: [PersonalBudgets]
 */
router.route("/member").post(checkToken, handleGetFamilyMemberBudgetByMonth);

/**
 * @swagger
 * /personal-budgets:
 *   get:
 *     summary: Získá všechny osobní rozpočty
 *     tags: [PersonalBudgets]
 */
router.route("/").get(checkToken, handleGetAllPersonalBudgets);

/**
 * @swagger
 * /personal-budgets/{id}:
 *   get:
 *     summary: Získá osobní rozpočet podle ID
 *     tags: [PersonalBudgets]
 */
router.route("/:id").get(checkToken, handleGetPersonalBudgetById);

/**
 * @swagger
 * /personal-budgets:
 *   post:
 *     summary: Vytvoří nový osobní rozpočet
 *     tags: [PersonalBudgets]
 */
router.route("/").post(checkToken, handleCreatePersonalBudget);

/**
 * @swagger
 * /personal-budgets/{id}:
 *   delete:
 *     summary: Smaže osobní rozpočet podle ID
 *     tags: [PersonalBudgets]
 */
router.route("/:id").delete(checkToken, handleDeletePersonalBudget);

/**
 * @swagger
 * /personal-budgets/{id}:
 *   put:
 *     summary: Aktualizuje osobní rozpočet podle ID
 *     tags: [PersonalBudgets]
 */
router.route("/:id").put(checkToken, handleUpdatePersonalBudget);

export default router;
