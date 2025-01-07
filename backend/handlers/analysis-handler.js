import {
    analyzeExceededSpendings,
    analyzeFinancialGoal,
    analyzeFinancialRisk,
    analyzeIncomeVsExpenses,
    analyzeSpendingsDistribution,
    analyzeTips,
    analyzeSpendingsReduction,
} from "../controllers/analysis-controller.js";
import { getBudgetByIdAndDate } from "../controllers/budget-controller.js";
import { getFinancialGoalById } from "../controllers/financial-goal-controller.js";
import { getUserById } from "../controllers/user-controller.js";

//Function for analysing personal financial risk
const handlePersonalRiskAnalysis = async (req, res) => {
    try {
        const { reserve } = req.body;

        const budgets = await helperGetBudgets(req.user._id, true);

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

//Function for analysing family financial risk
const handleFamilyRiskAnalysis = async (req, res) => {
    try {
        const { reserve } = req.body;

        const user = await getUserById(req.user._id);

        const budgets = await helperGetBudgets(user.familyAccount, false);

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

//Function for analysing personal financial goal
const handlePersonalFinancialGoalAnalysis = async (req, res) => {
    try {
        const { goalId, contribution } = req.body;
        const financialGoal = await getFinancialGoalById(goalId);

        //Check if financial goal is not expired
        const currDate = new Date();
        const dueDate = new Date(financialGoal.dueDate);
        const currYear = currDate.getFullYear();
        const dueYear = dueDate.getFullYear();
        const currMonth = currDate.getMonth();
        const dueMonth = dueDate.getMonth();

        if (
            dueYear < currYear ||
            (currYear === dueYear && dueMonth <= currMonth)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Finanční cíl je již propadlý. Zkuste nastavit nový cíl nebo upravit stávající.",
                data: null,
            });
        }

        //Check if goal is not completed
        if (financialGoal.currentAmount >= financialGoal.neededAmount) {
            return res.status(400).json({
                success: false,
                message: "Finanční cíl je již splněný.",
                data: null,
            });
        }

        const {
            financialGoalStatus,
            monthsToAchieveGoal,
            monthsToAchieveGoalRemaining,
            expectedMonthlyContribution,
            monthlyContributionAdjustment,
            requiredMonthlyContribution,
        } = await analyzeFinancialGoal(financialGoal, contribution);

        let summary = "";
        if (financialGoalStatus === "Dosáhnete") {
            summary =
                "S vaším aktuálním měsíčním příspěvkem dosáhnete cíle včas.";
        } else {
            summary = `Cíl nebude dosažen včas. Pro dosažení cíle včas je potřeba zvýšit měsíční příspěvek na ${requiredMonthlyContribution.toFixed(
                2
            )} Kč.`;
        }

        const budgets = await helperGetBudgets(req.user._id, true);

        let spendingReduction = [];
        if (budgets.length > 0 && financialGoalStatus !== "Dosáhnete") {
            spendingReduction = await analyzeSpendingsReduction(budgets);
        }

        return res.status(200).json({
            success: true,
            message: "",
            data: {
                financialGoalStatus,
                neededAmount: financialGoal.neededAmount,
                currentAmount: financialGoal.currentAmount,
                monthsToAchieveGoal,
                monthsToAchieveGoalRemaining,
                expectedMonthlyContribution,
                requiredMonthlyContribution,
                monthlyContributionAdjustment,
                summary,
                spendingReduction,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

//Function for analysing family financial goal
const handleFamilyFinancialGoalAnalysis = async (req, res) => {
    try {
        const { goalId, contribution } = req.body;
        const financialGoal = await getFinancialGoalById(goalId);

        //Check if financial goal is not expired
        const currDate = new Date();
        const dueDate = new Date(financialGoal.dueDate);
        const currYear = currDate.getFullYear();
        const dueYear = dueDate.getFullYear();
        const currMonth = currDate.getMonth();
        const dueMonth = dueDate.getMonth();

        if (
            dueYear < currYear ||
            (currYear === dueYear && dueMonth <= currMonth)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Finanční cíl je již propadlý. Zkuste nastavit nový cíl nebo upravit stávající.",
                data: null,
            });
        }

        //Check if goal is not completed
        if (financialGoal.currentAmount >= financialGoal.neededAmount) {
            return res.status(400).json({
                success: false,
                message: "Finanční cíl je již splněný.",
                data: null,
            });
        }

        const {
            financialGoalStatus,
            monthsToAchieveGoal,
            monthsToAchieveGoalRemaining,
            expectedMonthlyContribution,
            monthlyContributionAdjustment,
            requiredMonthlyContribution,
        } = await analyzeFinancialGoal(financialGoal, contribution);

        let summary = "";
        if (financialGoalStatus === "Dosáhnete") {
            summary =
                "S vaším aktuálním měsíčním příspěvkem dosáhnete rodinného cíle včas.";
        } else {
            summary = `Rodinný cíl nebude dosažen včas. Pro dosažení cíle včas je potřeba zvýšit měsíční příspěvek na ${requiredMonthlyContribution.toFixed(
                2
            )} Kč.`;
        }

        const user = await getUserById(req.user._id);

        const budgets = await helperGetBudgets(user.familyAccount, false);

        let spendingReduction = [];
        if (budgets.length > 0 && financialGoalStatus !== "Dosáhnete") {
            spendingReduction = await analyzeSpendingsReduction(budgets);
        }

        return res.status(200).json({
            success: true,
            message: "",
            data: {
                financialGoalStatus,
                neededAmount: financialGoal.neededAmount,
                currentAmount: financialGoal.currentAmount,
                monthsToAchieveGoal,
                monthsToAchieveGoalRemaining,
                expectedMonthlyContribution,
                requiredMonthlyContribution,
                monthlyContributionAdjustment,
                summary,
                spendingReduction,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

//Function returns budget based on id and isPersonal boolean value
const helperGetBudgets = async (id, isPersonal) => {
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
                id,
                currMonth,
                currYear,
                isPersonal
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

    return budgets;
};

//Function for analysing personal monthly budget
const handlePersonalBudgetAnalysis = async (req, res) => {
    try {
        //Getting previous months budget
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();
        let prevMonth = 0;
        let prevYear = 0;
        if (currMonth === 1) {
            prevMonth = 12;
            prevYear = currYear - 1;
        } else {
            prevMonth = currMonth - 1;
            prevYear = currYear;
        }

        const budget = await getBudgetByIdAndDate(
            req.user._id,
            prevMonth,
            prevYear,
            true
        );

        //Get income/expense analysis
        const incomeVsExpenses = await analyzeIncomeVsExpenses(budget);

        //Get exceeded spendings analysis
        const exceededSpendings = await analyzeExceededSpendings(budget);

        //Get spendingsDistribution analysis
        const spendingsDistribution = await analyzeSpendingsDistribution(
            budget
        );

        //Get tips for saving per category
        const tips = await analyzeTips();

        return res.status(200).json({
            success: true,
            message: "",
            data: {
                incomeVsExpenses,
                exceededSpendings,
                spendingsDistribution,
                tips,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

//Function for analysing family monthly budget
const handleFamilyBudgetAnalysis = async (req, res) => {
    try {
        //Getting previous months budget
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();
        let prevMonth = 0;
        let prevYear = 0;
        if (currMonth === 1) {
            prevMonth = 12;
            prevYear = currYear - 1;
        } else {
            prevMonth = currMonth - 1;
            prevYear = currYear;
        }

        const user = await getUserById(req.user._id);

        const budget = await getBudgetByIdAndDate(
            user.familyAccount,
            prevMonth,
            prevYear,
            false
        );

        //Get income/expense analysis
        const incomeVsExpenses = await analyzeIncomeVsExpenses(budget);

        //Get exceeded spendings analysis
        const exceededSpendings = await analyzeExceededSpendings(budget);

        //Get spendingsDistribution analysis
        const spendingsDistribution = await analyzeSpendingsDistribution(
            budget
        );

        //Get tips for saving per category
        const tips = await analyzeTips();

        return res.status(200).json({
            success: true,
            message: "",
            data: {
                incomeVsExpenses,
                exceededSpendings,
                spendingsDistribution,
                tips,
            },
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
    handlePersonalBudgetAnalysis,
    handleFamilyBudgetAnalysis,
};
