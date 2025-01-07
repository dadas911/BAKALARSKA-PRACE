import {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
    getSpendingsByBudgetId,
} from "../controllers/spendings-controller.js";

import {
    getBudgetById,
    updateBudget,
    getBudgetByIdAndDate,
} from "../controllers/budget-controller.js";
import { getUserById } from "../controllers/user-controller.js";
import { getAccountById } from "../controllers/family-account-controller.js";
import { getPersonalBudgetById } from "../controllers/personal-budget-controller.js";
import { getTransactionById } from "../controllers/transaction-controller.js";
import { createNotification } from "../controllers/notification-controller.js";
import { getCategoryById } from "../controllers/category-controller.js";

const handleGetAllSpendings = async (req, res) => {
    try {
        const data = await getAllSpendings();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetSpendingsById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getSpendingsById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateSpendings = async (req, res) => {
    try {
        let { spending, month, year } = req.body;
        let { name, totalAmount, category, isPersonal } = spending;

        let budgetId = "";

        //Connect spending to personal or family budget
        if (isPersonal) {
            budgetId = await getBudgetByIdAndDate(
                req.user._id,
                month,
                year,
                true
            );
            budgetId = budgetId._id;
        } else {
            const user = await getUserById(req.user._id);
            budgetId = await getBudgetByIdAndDate(
                user.familyAccount,
                month,
                year,
                false
            );
            budgetId = budgetId._id;
        }

        const newData = await helperCreateSpendings(
            name,
            totalAmount,
            category,
            isPersonal,
            req.user._id,
            budgetId,
            month,
            year
        );

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateSmartSpendings = async (req, res) => {
    try {
        const { spendingsPerCategory } = req.body;

        //Returning data (family spendings)
        const returnData = [];

        //Arrays for keeping all family/personal spendings
        const allFamilySpendings = [];
        const allPersonalSpendings = [];

        //Total allocated amount of all categories
        let allTotalAmounts = 0;

        //Create spending for family budget -> no computing needed
        for (const [categoryId, totalAmount] of Object.entries(
            spendingsPerCategory
        )) {
            //Skip those with zero budget allocated
            if (totalAmount <= 0) {
                continue;
            }
            const category = await getCategoryById(categoryId);
            //Push "spendings" structure to array
            const name = `Plán výdajů - ${category.name}`;
            allFamilySpendings.push({
                name,
                totalAmount,
                categoryId,
                isPersonal: false,
                senderId: req.user._id,
                budgetId: null,
                month: null,
                year: null,
            });

            allTotalAmounts += totalAmount;
        }

        //Section for Creating personal spendings using my "Smart formula"
        //Get array of all users in familyAccount
        const allFamilyUsers = [];
        const senderUser = await getUserById(req.user._id);
        const familyAccount = await getAccountById(senderUser.familyAccount);
        for (const userId of familyAccount.users) {
            const user = await getUserById(userId);
            if (user) {
                allFamilyUsers.push(user);
            }
        }

        //Go through spendingsPerCategory
        for (const [categoryId, totalSpendings] of Object.entries(
            spendingsPerCategory
        )) {
            //Skip categories with 0 budget allocation
            if (totalSpendings <= 0) {
                continue;
            }

            const category = await getCategoryById(categoryId);

            //Added modified incomes from all family users
            let totalModifiedIncome = 0;
            let familyModifiedIncome = 0;

            // Array for storing modified incomes per user for curr category
            let modifiedIncomesPerUser = [];

            //Go through users in family
            for (const user of allFamilyUsers) {
                //Skip user without personal budget
                if (user.personalBudget === null) {
                    continue;
                }

                //Get personal budget, weight for this category and calculate modified income
                const pBudget = await getPersonalBudgetById(
                    user.personalBudget
                );
                if (pBudget.expectedIncome <= 0) {
                    continue;
                }
                const categoryWeight = pBudget.weight?.get(categoryId) ?? 1;

                const modifiedIncome =
                    pBudget.expectedIncome *
                    pBudget.flexibility *
                    categoryWeight;

                //Add curr user modified income to rest
                totalModifiedIncome += modifiedIncome;
                familyModifiedIncome +=
                    pBudget.expectedIncome * pBudget.flexibility;
                modifiedIncomesPerUser.push({
                    user,
                    modifiedIncome,
                });
            }

            //Family does not have enough income for covering all spendings
            if (familyModifiedIncome < allTotalAmounts) {
                return res.status(200).json({
                    success: false,
                    data: null,
                    message:
                        "Rodina nemá dostatečné finance pro pokrytí všech výdajů, zvažte snížení výdajů či zvýšení flexibility",
                });
            }

            //Allocation based on income per user
            for (const { user, modifiedIncome } of modifiedIncomesPerUser) {
                const allocatedAmount =
                    Math.round(
                        ((modifiedIncome / totalModifiedIncome) *
                            totalSpendings) /
                            10
                    ) * 10;
                //Pushing "spendings" structure into array
                if (allocatedAmount > 0) {
                    const name = `Plán výdajů - ${category.name} (${user.username})`;
                    allPersonalSpendings.push({
                        name,
                        totalAmount: allocatedAmount,
                        categoryId,
                        isPersonal: true,
                        senderId: user._id,
                        budgetId: null,
                        month: null,
                        year: null,
                    });
                }
            }
        }

        //Go through array and create all family spendings
        for (const familySpending of allFamilySpendings) {
            const createdSpending = await helperCreateSpendings(
                familySpending.name,
                familySpending.totalAmount,
                familySpending.categoryId,
                familySpending.isPersonal,
                familySpending.senderId
            );
            if (createdSpending) {
                returnData.push(createdSpending);
            }
        }

        //Go through array and create all personal spendings
        for (const personalSpending of allPersonalSpendings) {
            await helperCreateSpendings(
                personalSpending.name,
                personalSpending.totalAmount,
                personalSpending.categoryId,
                personalSpending.isPersonal,
                personalSpending.senderId
            );
        }

        res.status(200).json({ success: true, data: returnData, message: "" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteSpendings = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteSpendings(id);

        //Spending is in some budget -> delete it from there
        if (deletedData.budget) {
            let budget = await getBudgetById(deletedData.budget);
            budget.spendings = budget.spendings.filter(
                (spending_id) => spending_id.toString() !== id
            );
            await updateBudget(budget._id, budget);
        }

        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateSpendings = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateSpendings(id, newData);

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetPersonalSpendingsByMonth = async (req, res) => {
    try {
        const { month, year } = req.body;
        const pBudget = await getBudgetByIdAndDate(
            req.user._id,
            month,
            year,
            true
        );

        const spendings = await getSpendingsByBudgetId(pBudget._id);

        res.status(200).json(spendings);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetFamilyMemberSpendingsByMonth = async (req, res) => {
    try {
        const { id, month, year } = req.body;
        //Get personal budget from requested month and year
        const pBudget = await getBudgetByIdAndDate(id, month, year, true);
        const spendings = await getSpendingsByBudgetId(pBudget._id);

        res.status(200).json(spendings);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetFamilySpendingsByMonth = async (req, res) => {
    try {
        const { month, year } = req.body;
        const user = await getUserById(req.user._id);
        //Get family budget from requested month and year
        const fBudget = await getBudgetByIdAndDate(
            user.familyAccount,
            month,
            year,
            false
        );

        const spendings = await getSpendingsByBudgetId(fBudget._id);

        res.status(200).json(spendings);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const helperGetSpentAmount = async (pBudgetId, categoryId) => {
    //Check for already existing transactions in same category
    let spentAmount = 0;
    const pBudget = await getPersonalBudgetById(pBudgetId);
    //Go through all transaction of personal budget
    for (const transactionId of pBudget.transactions) {
        const transaction = await getTransactionById(transactionId);
        //If it is the same category as spending -> add it to "spentAmount"
        if (transaction.category == categoryId) {
            spentAmount += Math.abs(transaction.amount);
        }
    }

    return spentAmount;
};

// -------------- Helper functions for create spendings -> reused in 2 handlers ---------------------

//Creates notifications if spentAmount > totalAmount
const helperCreateNotification = async (
    name,
    totalAmount,
    spentAmount,
    category,
    isPersonal,
    userId
) => {
    if (spentAmount > totalAmount) {
        const currCategory = await getCategoryById(category);
        //Creating presonal notification
        if (isPersonal) {
            await createNotification({
                name: "Překročení osobního výdajového plánu",
                text:
                    'Překročili jste plán výdaje "' +
                    name +
                    '" v kategorii "' +
                    currCategory.name +
                    '". Naplánovaná částka je ' +
                    totalAmount +
                    ", vy jste již utratili " +
                    spentAmount +
                    ".",
                user: userId,
            });
        }
        //Creating family notification
        else {
            await createNotification({
                name: "Překročení rodinného výdajového plánu",
                text:
                    'Překročili jste plán výdaje "' +
                    name +
                    '" v kategorii "' +
                    currCategory.name +
                    '". Naplánovaná částka je ' +
                    totalAmount +
                    ", rodina utratila již " +
                    spentAmount +
                    ".",
                user: userId,
            });
        }
    }
};

//Functions that handles getting spent amount and creating notification
const helperSpentAmountAndNotification = async (
    name,
    totalAmount,
    category,
    isPersonal,
    userId,
    budgetId,
    month,
    year
) => {
    const user = await getUserById(userId);
    let budget = "";
    let spentAmount = 0;
    //Spendings belongs to personal budget
    if (isPersonal) {
        if (!budgetId) {
            budget = user.personalBudget;
        } else {
            budget = budgetId;
        }

        //Check for already existing transactions in same category
        spentAmount += await helperGetSpentAmount(budget, category);

        //SpentAmount > totalAmount -> create notification
        await helperCreateNotification(
            name,
            totalAmount,
            spentAmount,
            category,
            isPersonal,
            userId
        );
    }
    //Spendings belongs to family account
    else {
        const account = await getAccountById(user.familyAccount);
        if (!budgetId) {
            budget = account.familyBudget;
        } else {
            budget = budgetId;
        }
        //Get spentAmount from all family users
        for (const userId of account.users) {
            const user = await getUserById(userId);
            try {
                let personalBudgetId = user.personalBudget;
                if (month && year) {
                    personalBudgetId = await getBudgetByIdAndDate(
                        user._id,
                        month,
                        year,
                        true
                    );
                    personalBudgetId = personalBudgetId._id;
                }
                spentAmount += await helperGetSpentAmount(
                    personalBudgetId,
                    category
                );
            } catch (error) {}
        }
        for (const userId of account.users) {
            //SpentAmount > totalAmount -> create notification
            helperCreateNotification(
                name,
                totalAmount,
                spentAmount,
                category,
                isPersonal,
                userId
            );
        }
    }

    return { spentAmount, budget };
};

// Functions that creates new spending used in 2 handlers
// 1) handleCreateSpending -> handler for manualy created spendings -> only wrapper
// 2) handleCreateSmartSpendings -> handler for "smart" creation of spendings
// That is the reason why I needed to extract whole createSpendings logic into helper function and wrap it inside first handler
const helperCreateSpendings = async (
    name,
    totalAmount,
    category,
    isPersonal,
    senderId,
    budgetId,
    month,
    year
) => {
    const { spentAmount, budget } = await helperSpentAmountAndNotification(
        name,
        totalAmount,
        category,
        isPersonal,
        senderId,
        budgetId,
        month,
        year
    );

    const newData = await createSpendings({
        name,
        totalAmount,
        spentAmount,
        budget,
        category,
    });

    //Add new spending to the budget
    let budgetData = await getBudgetById(budget);
    if (!budgetData) {
        res.status(404).json({ message: "Rozpočet nebyl nalezen" });
    }
    budgetData.spendings.push(newData._id);
    await updateBudget(budget, budgetData);

    return newData;
};

export {
    handleGetAllSpendings,
    handleGetSpendingsById,
    handleCreateSpendings,
    handleDeleteSpendings,
    handleUpdateSpendings,
    handleGetPersonalSpendingsByMonth,
    handleGetFamilyMemberSpendingsByMonth,
    handleGetFamilySpendingsByMonth,
    handleCreateSmartSpendings,
};
