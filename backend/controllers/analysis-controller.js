import { getCategoryById } from "./category-controller.js";
import { getSpendingsById } from "./spendings-controller.js";

//Saving tips for every "default"
const savingsTipsPerCategory = {
    Bydlení: [
        "Zvažte možnost snížení nákladů na energie (např. úsporné spotřebiče, LED osvětlení).",
        "Pokud je to možné, snižte náklady na nájem (např. přechod na menší byt nebo sdílení nákladů s dalšími osobami).",
        "Pravidelně kontrolujte nabídky na energie a pojištění a hledejte výhodnější tarify.",
    ],
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
    Oblečení: [
        "Kupujte oblečení během sezónních výprodejů a slev.",
        "Zvažte nákup second-hand oblečení nebo výměnné akce.",
    ],
    Zábava: [
        "Vyhledávat bezplatné nebo levnější aktivity.",
        "Omezit návštěvy drahých akcí a zábavních zařízení.",
        "Udělat si přehled v placených předplatných (např. Netflix).",
    ],
    Studium: [
        "Vyhledávejte levnější nebo bezplatné online kurzy a materiály.",
        "Nakupujte učebnice a materiály z druhé ruky nebo si je půjčujte.",
        "Využívejte slevy pro studenty na různé služby a produkty.",
    ],
    Ostatní: [
        "Sledujte svoje výdaje v této kategorii a hledejte možnosti, jak je omezit.",
        "Zaměřte se na nákupy pouze nezbytných věcí, pokud to není urgentní, počkejte na výprodeje nebo slevy.",
    ],
};

//Functions for analysing financial risk based on reserve and monthly expense
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

//Function for analysing spendings and their posible reduction
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

//Function for analysing financial goal
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

//Function returns income vs expense analysis
const analyzeIncomeVsExpenses = async (budget) => {
    const totalIncome = budget.income;
    const totalExpenses = -budget.expense;
    const balance = totalIncome - totalExpenses;
    let status = "";
    let summary = "";
    let recommendation = "";
    //Expenses are greater than income -> bad status
    if (totalExpenses > totalIncome) {
        status = "Výdaje jsou větší než příjmy";
        summary =
            "Výdaje překračují příjmy, což znamená, že se dostáváte do finančního deficitu. Toto může vést dlouhodobě k finančním problémům.";
        recommendation =
            "Zaměřte se na omezení výdajů v méně prioritních kategoriích nebo zvažte zvýšení příjmů.";
    }
    //Balance is < 15% of income -> warning status
    else if (balance < (totalIncome / 100) * 15) {
        status = "Těsný rozpočet";
        summary =
            "Vaše výdaje se téměř rovnají příjmům, což znamená, že máte omezené volné finance.";
        recommendation =
            "Snažte se ušetřit v méně důležitých oblastech, abyste vytvořili větší rezervu a uvolnili více peněz.";
    }
    //Balance is more than 15% than income -> good status
    else {
        status = "Výdaje pod kontrolou";
        summary = "Váš rozpočet jsou pod kontrolou a máte přebytek financí.";
        recommendation =
            "Odložte přebytek do rezervy nebo ho investujte do dlouhodobých cílů.";
    }

    return {
        totalIncome,
        totalExpenses,
        balance,
        status,
        summary,
        recommendation,
    };
};

//Functions returns exceeded spendings analysis
const analyzeExceededSpendings = async (budget) => {
    const result = [];
    //Go through all budget spendings
    for (const spendingId of budget.spendings) {
        const spending = await getSpendingsById(spendingId);
        //Spending is exceeded -> add to result
        if (spending.totalAmount < spending.spentAmount) {
            const name = spending.name;
            const categoryData = await getCategoryById(spending.category);
            const category = categoryData.name;
            const totalAmount = spending.totalAmount;
            const spentAmount = spending.spentAmount;
            const difference = spentAmount - totalAmount;
            result.push({
                name,
                category,
                totalAmount,
                spentAmount,
                difference,
            });
        }
    }

    let status = "";
    let summary = "";
    let recommendation = "";
    //Check if some spendings were exceeded
    if (result.length > 0) {
        status = "Překročení některých výdajových plánů";
        summary = "Výdaje v několika kategoriích překročily plán.";
        recommendation =
            "Zaměřte se na tyto kategorie a hledejte možnosti úspor. Můžete zvážit nastavení jiného limitu.";
    } else {
        status = "Žádné překročení";
        summary = "Žádný plán výdajů nebyl překročen, vše je v rámci plánu.";
        recommendation = "Skvěle! Pokračujte v efektivní správě rozpočtu.";
    }

    return { exceededSpendings: result, status, summary, recommendation };
};

//Setting up recommended % of income per category
const recommendedSpendingsDistribution = {
    Bydlení: 5,
    Jídlo: 10,
    Doprava: 10,
    Oblečení: 10,
    Zábava: 10,
    Studium: 5,
    Ostatní: 5,
};

//Function returns summary of spendings distribution
const analyzeSpendingsDistribution = async (budget) => {
    const totalIncome = budget.income;
    const distributionPerCategory = [];
    const processedCategories = new Map();

    // First, iterate through spendings and accumulate spentAmount for each category
    for (const spendingId of budget.spendings) {
        const spending = await getSpendingsById(spendingId);
        const categoryData = await getCategoryById(spending.category);
        const name = categoryData.name;

        // If the category already exists, add the amount to the existing one
        if (processedCategories.has(name)) {
            processedCategories.set(
                name,
                processedCategories.get(name) + spending.spentAmount
            );
        } else {
            processedCategories.set(name, spending.spentAmount);
        }
    }

    // Now process each category to calculate incomePercentage and status
    const exceededCategories = [];
    for (const [name, totalSpent] of processedCategories) {
        const incomePercentage = (totalSpent / totalIncome) * 100;

        let status = "";
        if (incomePercentage > (recommendedSpendingsDistribution[name] || 0)) {
            status = `Limit překročen (${recommendedSpendingsDistribution[name]}%)`;
            exceededCategories.push(name);
        } else {
            status = `V rámci limitu  (${recommendedSpendingsDistribution[name]}%)`;
        }

        distributionPerCategory.push({ name, incomePercentage, status });
    }

    // Generate summary and recommendation based on exceeded categories
    let summary = "";
    let recommendation = "";
    if (exceededCategories.length > 0) {
        summary = `Překročení limitu v kategoriích: ${exceededCategories.join(
            ", "
        )}.`;
        recommendation = "Zaměřte se na úpravu výdajů v těchto kategoriích.";
    } else {
        summary = "Všechny kategorie jsou v rámci doporučených limitů.";
        recommendation =
            "Pokračujte ve správě výdajů podle doporučených limitů.";
    }

    return { distributionPerCategory, summary, recommendation };
};

//Get saving tips for all "Default" categories
const analyzeTips = async () => {
    return savingsTipsPerCategory;
};

export {
    analyzeFinancialRisk,
    analyzeSpendingsReduction,
    analyzeFinancialGoal,
    analyzeExceededSpendings,
    analyzeIncomeVsExpenses,
    analyzeSpendingsDistribution,
    analyzeTips,
};
