import {
    getBudgetById,
    updateBudget,
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
} from "../controllers/transaction-controller.js";
import { getAccountById } from "../controllers/family-account-controller.js";
import { getUserById } from "../controllers/user-controller.js";
import { updatePersonalBudget } from "../controllers/personal-budget-controller.js";

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
        const { name, amount, date, description, personalBudget, category } =
            req.body;
        const newData = await createTransaction({
            name,
            amount,
            date,
            description,
            personalBudget,
            category,
        });

        await modifyBalanceAndSpendingsHelper(personalBudget, amount, category);

        //Add transaction._id to budget
        //Add new spending to the budget
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

        await modifyBalanceAndSpendingsHelper(
            deletedData.personalBudget,
            -deletedData.amount,
            deletedData.category.toString()
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

        await modifyBalanceAndSpendingsHelper(
            updatedData.personalBudget,
            updatedData.amount - oldData.amount,
            updatedData.category.toString()
        );

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

//Functions that modifies relevant spendings + budget balance by transaction.amount
const modifyBalanceAndSpendingsHelper = async (
    personalBudgetId,
    amount,
    category
) => {
    //Update spentAmount in spendings - personal budget
    const pBudget = await getBudgetById(personalBudgetId);
    if (!pBudget) {
        res.status(404).json({ message: "Rozpočet nebyl nalezen" });
    }

    //Add amount to income or expense of Personal Budget
    if (amount > 0) {
        pBudget.income += amount;
    } else {
        pBudget.expense += amount;
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
        personalSpending.spentAmount += Math.abs(amount);
        await updateSpendings(personalSpending._id, personalSpending);
    }

    //Update spentAmount in spendings - family budget
    const user = await getUserById(pBudget.user);
    let familyAccount = null;
    if (user.familyAccount) {
        familyAccount = await getAccountById(user.familyAccount);
        const fBudget = await getBudgetById(familyAccount.familyBudget);
        if (!fBudget) {
            res.status(404).json({ message: "Rozpočet nebyl nalezen" });
        }

        //Add amount to income or expense of Family Budget
        if (amount > 0) {
            fBudget.income += amount;
        } else {
            fBudget.expense += amount;
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
            familySpending.spentAmount += Math.abs(amount);
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
};
