import { getCategoryById } from "./category-controller.js";
import { getSpendingsById } from "./spendings-controller.js";

const savingsTipsPerCategory = {
    Jídlo: [
        "Více si vařit sám, méně dováženého jídla a restaurací.",
        "Využívat slevy a akce v obchodech.",
        "Plánovat týdenní menu a nakupovat podle seznamu.",
    ],
    Doprava: [
        "Používat veřejnou dopravu místo auta.",
        "Sdílet jízdy s ostatními.",
        "Přemýšlet o jízdě na kole nebo chůzi na kratší vzdálenosti.",
    ],
    Zábava: [
        "Vyhledávat bezplatné nebo levnější aktivity.",
        "Omezit návštěvy drahých akcí a zábavních zařízení.",
        "Udělat si přehled v placených předplatných (např. Netflix)",
    ],
};

const analyzeFinancialRisk = async (reserve, monthlyExpenses) => {
    //Recommended reserve = 3 * monthly expenses
    const recommendedReserve = monthlyExpenses * 3;
    //Calculating risk
    const monthCovered = reserve / monthlyExpenses;
    let financialRiskLevel = "";
    if (monthCovered <= 1) {
        financialRiskLevel = "Vysoké";
    } else if (monthCovered < 3) {
        financialRiskLevel = "Střední";
    } else {
        financialRiskLevel = "Nízké";
    }

    //Calculate how much money until recommended reserve
    let increaseReserve = 0;
    if (reserve < recommendedReserve) {
        increaseReserve = recommendedReserve - reserve;
    }

    return {
        recommendedReserve: recommendedReserve,
        financialRiskLevel: financialRiskLevel,
        increaseReserve: increaseReserve,
        monthCovered: monthCovered,
    };
};

const analyzeSpendingsReduction = async (budgets) => {
    const categoryInformation = {};
    //Go through budgets
    for (const budget of budgets) {
        //Go through every budget spendings
        for (const spendingId of budget.spendings) {
            const spending = await getSpendingsById(spendingId);

            const currCategoryId = spending.category;
            const currCategory = await getCategoryById(currCategoryId);
            //Create new structure if not exists
            if (!categoryInformation[currCategoryId]) {
                categoryInformation[currCategoryId] = {
                    name: currCategory.name,
                    totalSpending: 0,
                    count: 0,
                    reductionRate: currCategory.reductionRate,
                };
            }

            //Add data to existing structure
            categoryInformation[currCategoryId].totalSpending +=
                spending.spentAmount;
            categoryInformation[currCategoryId].count += 1;
        }
    }

    const result = [];

    // Create results
    for (const currCategoryId in categoryInformation) {
        const currCategory = categoryInformation[currCategoryId];

        //Do not include categories which could not be optimised
        if (currCategory.reductionRate === 0) {
            continue;
        }

        //Calculate result information
        const averageSpending = currCategory.totalSpending / currCategory.count;
        const adjustedSpending =
            averageSpending * (1 - currCategory.reductionRate / 100);
        const saving = averageSpending - adjustedSpending;

        //Push result into all results
        result.push({
            category: currCategory.name,
            averageSpendings: averageSpending,
            reductionRate: currCategory.reductionRate,
            adjustedSpendings: adjustedSpending,
            saving: saving,
            tips: savingsTipsPerCategory[currCategory.name] || [],
        });
    }

    return result;
};

const analyzeFinancialGoal = async (goal, contribution) => {
    // Calculate month to achieve goal
    const remainingAmount = goal.neededAmount - goal.currentAmount;
    const monthsToAchieveGoal = Math.ceil(remainingAmount / contribution);

    // Calculate how many month are remaining to dueDate
    const dueDate = new Date(goal.dueDate);
    const currDate = new Date();

    const dueYear = dueDate.getFullYear();
    const dueMonth = dueDate.getMonth();

    const currentYear = currDate.getFullYear();
    const currentMonth = currDate.getMonth();

    const yearDifference = dueYear - currentYear;
    const monthDifference = dueMonth - currentMonth;

    const monthsToAchieveGoalRemaining = yearDifference * 12 + monthDifference;

    // Setting status
    let financialGoalStatus = "Dosáhnete";
    if (monthsToAchieveGoal > monthsToAchieveGoalRemaining) {
        financialGoalStatus = "Nedosáhnete";
    }

    // Calculate how much money is needed
    const requiredMonthlyContribution =
        remainingAmount / monthsToAchieveGoalRemaining;

    let monthlyContributionAdjustment = 0;
    if (requiredMonthlyContribution > contribution) {
        monthlyContributionAdjustment =
            requiredMonthlyContribution - contribution;
    }

    return {
        financialGoalStatus,
        monthsToAchieveGoal,
        monthsToAchieveGoalRemaining,
        expectedMonthlyContribution: contribution,
        monthlyContributionAdjustment,
        requiredMonthlyContribution,
    };
};

export {
    analyzeFinancialRisk,
    analyzeSpendingsReduction,
    analyzeFinancialGoal,
};
