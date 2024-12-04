import express from "express";
import {
    handlePersonalFinancialGoalAnalysis,
    handleFamilyFinancialGoalAnalysis,
    handlePersonalRiskAnalysis,
    handleFamilyRiskAnalysis,
} from "../handlers/analysis-handler.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/personalrisk").post(checkToken, handlePersonalRiskAnalysis);
router.route("/familyrisk").post(checkToken, handleFamilyRiskAnalysis);
router
    .route("/personalgoal")
    .post(checkToken, handlePersonalFinancialGoalAnalysis);
router.route("/familygoal").post(checkToken, handleFamilyFinancialGoalAnalysis);

export default router;
