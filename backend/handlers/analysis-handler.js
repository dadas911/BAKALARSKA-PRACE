import {
    analyzeFinancialRisk,
    analyzeSpendingsReduction,
} from "../controllers/analysis-controller.js";
import { getBudgetByIdAndDate } from "../controllers/budget-controller.js";
import { getUserById } from "../controllers/user-controller.js";

const handlePersonalRiskAnalysis = async (req, res) => {
    try {
        const { reserve } = req.body;

        const currDate = new Date();
        let currMonth = currDate.getMonth() + 1;
        let currYear = currDate.getFullYear();
        //Getting avarage monthly spendings/expenses
        const budgets = [];

        if (currMonth === 1) {
            currMonth = 12;
            currYear = currYear - 1;
        } else {
            currMonth = currMonth - 1;
        }

        //Calculating avarage monthly expenses
        for (let i = 0; i < 6; i++) {
            let currBudget = null;
            try {
                currBudget = await getBudgetByIdAndDate(
                    req.user._id,
                    currMonth,
                    currYear,
                    true
                );
            } catch (error) {}

            if (currBudget) {
                budgets.push(currBudget);
            }

            currMonth--;

            if (currMonth < 1) {
                currMonth = 12;
                currYear--;
            }
        }

        if (budgets.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Žádné předchozí měsíční rozpočty k dispozici. Pro provedení analýzu finančního rizika je nutné mít alespoň jeden předchozí měsíční rozpočet (maximálně 6 měsíců starý)",
                data: null,
            });
        }

        const allExpenses = budgets.reduce(
            (sum, budget) => sum + budget.expense,
            0
        );

        const averageMonthlyExpenses = Math.abs(allExpenses / budgets.length);

        //Getting recommendedReserve, financialRiskLevel and increaseReserve
        const {
            recommendedReserve,
            financialRiskLevel,
            increaseReserve,
            monthCovered,
        } = await analyzeFinancialRisk(reserve, averageMonthlyExpenses);

        let summary = "";
        if (financialRiskLevel === "Nízké") {
            summary =
                "Vaše finanční riziko je nízké, není potřeba upravovat Vaší finanční rezervu";
        } else if (financialRiskLevel === "Střední") {
            summary =
                "Vaše finanční riziko je střední, je potřeba trochu navýšit Vaší finanční rezervu";
        } else {
            summary =
                "Vaše finanční riziko je vysoké, je potřeba upravit rozpočet a co nejdříve navýšit Vaší finanční rezervu";
        }

        let spendingReduction = [];
        if (
            financialRiskLevel === "Střední" ||
            financialRiskLevel === "Vysoké"
        ) {
            spendingReduction = await analyzeSpendingsReduction(budgets);
        }

        return res.status(200).json({
            success: true,
            message: "",
            data: {
                financialRiskLevel,
                averageMonthlyExpenses,
                reserve,
                recommendedReserve,
                increaseReserve,
                summary,
                monthCovered,
                spendingReduction,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

const handleFamilyRiskAnalysis = async (req, res) => {
    try {
        const { reserve } = req.body;

        const currDate = new Date();
        let currMonth = currDate.getMonth() + 1;
        let currYear = currDate.getFullYear();
        //Getting avarage monthly spendings/expenses
        const budgets = [];

        if (currMonth === 1) {
            currMonth = 12;
            currYear = currYear - 1;
        } else {
            currMonth = currMonth - 1;
        }

        const user = await getUserById(req.user._id);

        //Calculating avarage monthly expenses
        for (let i = 0; i < 6; i++) {
            let currBudget = null;
            try {
                currBudget = await getBudgetByIdAndDate(
                    user.familyAccount,
                    currMonth,
                    currYear,
                    false
                );
            } catch (error) {}

            if (currBudget) {
                budgets.push(currBudget);
            }

            currMonth--;

            if (currMonth < 1) {
                currMonth = 12;
                currYear--;
            }
        }

        if (budgets.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Žádné předchozí měsíční rozpočty k dispozici. Pro provedení analýzu finančního rizika je nutné mít alespoň jeden předchozí měsíční rozpočet (maximálně 6 měsíců starý)",
                data: null,
            });
        }

        const allExpenses = budgets.reduce(
            (sum, budget) => sum + budget.expense,
            0
        );

        const averageMonthlyExpenses = Math.abs(allExpenses / budgets.length);

        //Getting recommendedReserve, financialRiskLevel and increaseReserve
        const {
            recommendedReserve,
            financialRiskLevel,
            increaseReserve,
            monthCovered,
        } = await analyzeFinancialRisk(reserve, averageMonthlyExpenses);

        let summary = "";
        if (financialRiskLevel === "Nízké") {
            summary =
                "Vaše rodinné finanční riziko je nízké, není potřeba upravovat Vaší finanční rezervu";
        } else if (financialRiskLevel === "Střední") {
            summary =
                "Vaše rodinné finanční riziko je střední, je potřeba trochu navýšit Vaší finanční rezervu";
        } else {
            summary =
                "Vaše rodinné finanční riziko je vysoké, je potřeba upravit rozpočet a co nejdříve navýšit Vaší finanční rezervu";
        }

        let spendingReduction = [];
        if (
            financialRiskLevel === "Střední" ||
            financialRiskLevel === "Vysoké"
        ) {
            spendingReduction = await analyzeSpendingsReduction(budgets);
        }

        return res.status(200).json({
            success: true,
            message: "",
            data: {
                financialRiskLevel,
                averageMonthlyExpenses,
                reserve,
                recommendedReserve,
                increaseReserve,
                summary,
                monthCovered,
                spendingReduction,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

const handlePersonalFinancialGoalAnalysis = async (req, res) => {
    try {
        const { goalId, contribution } = req.body;
        res.status(200).json({
            success: true,
            message:
                "Id finančního gólu: " +
                goalId +
                " , měsíční osobní příspěvek: " +
                contribution,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

const handleFamilyFinancialGoalAnalysis = async (req, res) => {
    try {
        const { goalId, contribution } = req.body;
        res.status(200).json({
            success: true,
            message:
                "Id finančního gólu: " +
                goalId +
                " , měsíční měsíční příspěvek: " +
                contribution,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    handlePersonalFinancialGoalAnalysis,
    handleFamilyFinancialGoalAnalysis,
    handlePersonalRiskAnalysis,
    handleFamilyRiskAnalysis,
};
