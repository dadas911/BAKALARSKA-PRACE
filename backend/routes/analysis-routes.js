import express from "express";
import {
    handlePersonalFinancialGoalAnalysis,
    handleFamilyFinancialGoalAnalysis,
    handlePersonalRiskAnalysis,
    handleFamilyRiskAnalysis,
    handlePersonalBudgetAnalysis,
    handleFamilyBudgetAnalysis,
} from "../handlers/analysis-handler.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

/**
 * @swagger
 * /analysis/personalrisk:
 *   post:
 *     summary: Provádí analýzu osobního finančního rizika
 *     tags: [Analysis]
 */
router.route("/personalrisk").post(checkToken, handlePersonalRiskAnalysis);

/**
 * @swagger
 * /analysis/familyrisk:
 *   post:
 *     summary: Provádí analýzu rodinného finančního rizika
 *     tags: [Analysis]
 */
router.route("/familyrisk").post(checkToken, handleFamilyRiskAnalysis);

/**
 * @swagger
 * /analysis/personalgoal:
 *   post:
 *     summary: Provádí analýzu osobního finančního cíle
 *     tags: [Analysis]
 */
router
    .route("/personalgoal")
    .post(checkToken, handlePersonalFinancialGoalAnalysis);

/**
 * @swagger
 * /analysis/familygoal:
 *   post:
 *     summary: Provádí analýzu rodinného finančního cíle
 *     tags: [Analysis]
 */
router.route("/familygoal").post(checkToken, handleFamilyFinancialGoalAnalysis);

/**
 * @swagger
 * /analysis/personalbudget:
 *   post:
 *     summary: Provádí analýzu osobního rozpočtu
 *     tags: [Analysis]
 */
router.route("/personalbudget").post(checkToken, handlePersonalBudgetAnalysis);

/**
 * @swagger
 * /analysis/familybudget:
 *   post:
 *     summary: Provádí analýzu rodinného rozpočtu
 *     tags: [Analysis]
 */
router.route("/familybudget").post(checkToken, handleFamilyBudgetAnalysis);

export default router;
