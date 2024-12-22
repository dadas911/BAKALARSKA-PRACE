import {
    getBudgetById,
    updateBudget,
    getBudgetByIdAndDate,
} from "../controllers/budget-controller.js";
import {
    getSpendingsById,
    updateSpendings,
} from "../controllers/spendings-controller.js";
import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionByBudgetId,
} from "../controllers/transaction-controller.js";
import { getAccountById } from "../controllers/family-account-controller.js";
import { getUserById } from "../controllers/user-controller.js";
import { updatePersonalBudget } from "../controllers/personal-budget-controller.js";
import { getCategoryById } from "../controllers/category-controller.js";

const handleGetAllTransactions = async (req, res) => {
    try {
        const data = await getAllTransactions();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTransactionById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateTransaction = async (req, res) => {
    try {
        let { transaction, month, year } = req.body;
        let { name, amount, date, description, category } = transaction;

        const user = await getUserById(req.user._id);
        let personalBudget = await getBudgetByIdAndDate(
            user._id,
            month,
            year,
            true
        );
        personalBudget = personalBudget._id;
        const cat = await getCategoryById(category);

        if (cat.isExpense) {
            amount = -amount;
        }

        let isIncome = true;
        if (amount < 0) {
            isIncome = false;
        }

        const newData = await createTransaction({
            name,
            amount,
            date,
            description,
            personalBudget,
            category,
        });

        await modifyBalanceAndSpendingsHelper(
            personalBudget,
            amount,
            category,
            isIncome
        );

        //Add transaction._id to budget
        let budget = await getBudgetById(personalBudget);
        if (!budget) {
            res.status(404).json({ message: "Rozpočet nebyl nalezen" });
        }
        budget.transactions.push(newData._id);
        await updatePersonalBudget(personalBudget, budget);

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedData = await deleteTransaction(id);
        let isIncome = true;
        if (deletedData.amount < 0) {
            isIncome = false;
        }

        await modifyBalanceAndSpendingsHelper(
            deletedData.personalBudget,
            -deletedData.amount,
            deletedData.category.toString(),
            isIncome
        );

        //Spending is in some budget -> delete it from there
        if (deletedData.personalBudget) {
            let budget = await getBudgetById(deletedData.personalBudget);

            budget.transactions = budget.transactions.filter(
                (transaction_id) => transaction_id.toString() !== id
            );
            await updatePersonalBudget(budget._id, budget);
        }

        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const oldData = await getTransactionById(id);
        const updatedData = await updateTransaction(id, newData);

        let isIncome = true;
        if (updatedData.amount < 0) {
            isIncome = false;
        }

        await modifyBalanceAndSpendingsHelper(
            updatedData.personalBudget,
            updatedData.amount - oldData.amount,
            updatedData.category.toString(),
            isIncome
        );

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetTransactionsByMonth = async (req, res) => {
    try {
        const { month, year } = req.body;
        const user = await getUserById(req.user._id);
        const pBudget = await getBudgetByIdAndDate(user, month, year, true);
        const transactions = await getTransactionByBudgetId(pBudget._id);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

//Functions that modifies relevant spendings + budget balance by transaction.amount
const modifyBalanceAndSpendingsHelper = async (
    personalBudgetId,
    amount,
    category,
    isIncome
) => {
    //Update spentAmount in spendings - personal budget
    const pBudget = await getBudgetById(personalBudgetId);
    if (!pBudget) {
        res.status(404).json({ message: "Rozpočet nebyl nalezen" });
    }

    //Add amount to income or expense of Personal Budget
    if (isIncome) {
        pBudget.income += Number(amount);
    } else {
        pBudget.expense += Number(amount);
    }

    await updateBudget(pBudget._id, pBudget);

    let personalSpending = null;

    for (const spending_id of pBudget.spendings) {
        let curr_spending = await getSpendingsById(spending_id);
        if (curr_spending.category.toString() === category) {
            personalSpending = curr_spending;
            break;
        }
    }

    if (personalSpending) {
        personalSpending.spentAmount -= amount;
        personalSpending.spentAmount = Math.abs(personalSpending.spentAmount);
        await updateSpendings(personalSpending._id, personalSpending);
    }

    //Update spentAmount in spendings - family budget
    const user = await getUserById(pBudget.user);
    if (user.familyAccount) {
        const fBudget = await getBudgetByIdAndDate(
            user.familyAccount,
            pBudget.month,
            pBudget.year,
            false
        );
        if (!fBudget) {
            res.status(404).json({ message: "Rozpočet nebyl nalezen" });
        }
        console.log("Family budget found");

        //Add amount to income or expense of Family Budget
        if (isIncome) {
            fBudget.income += Number(amount);
        } else {
            fBudget.expense += Number(amount);
        }

        await updateBudget(fBudget._id, fBudget);

        let familySpending = null;

        for (const spending_id of fBudget.spendings) {
            let curr_spending = await getSpendingsById(spending_id);
            if (curr_spending.category.toString() === category) {
                familySpending = curr_spending;
                break;
            }
        }

        if (familySpending) {
            familySpending.spentAmount -= amount;
            familySpending.spentAmount = Math.abs(familySpending.spentAmount);
            await updateSpendings(familySpending._id, familySpending);
        }
    }
};

export {
    handleGetAllTransactions,
    handleGetTransactionById,
    handleCreateTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
    handleGetTransactionsByMonth,
};
