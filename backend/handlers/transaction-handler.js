import { getBudgetById } from "../controllers/budget-controller.js";
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

        await modifySpentAmountHelper(personalBudget, amount, category);

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedData = await deleteTransaction(id);

        await modifySpentAmountHelper(
            deletedData.personalBudget,
            -deletedData.amount,
            deletedData.category.toString()
        );

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

        await modifySpentAmountHelper(
            updatedData.personalBudget,
            updatedData.amount - oldData.amount,
            updatedData.category.toString()
        );

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

//Functions that modifies relevant spendings by transaction.amount
const modifySpentAmountHelper = async (personalBudgetId, amount, category) => {
    //Update spentAmount in spendings - personal budget
    const pBudget = await getBudgetById(personalBudgetId);
    if (!pBudget) {
        res.status(404).json({ message: "Rozpočet nebyl nalezen" });
    }

    let personalSpending = null;

    for (const spending_id of pBudget.spendings) {
        let curr_spending = await getSpendingsById(spending_id);
        if (curr_spending.category.toString() === category) {
            personalSpending = curr_spending;
            break;
        }
    }

    if (personalSpending) {
        personalSpending.spentAmount += amount;
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

        let familySpending = null;

        for (const spending_id of fBudget.spendings) {
            let curr_spending = await getSpendingsById(spending_id);
            if (curr_spending.category.toString() === category) {
                familySpending = curr_spending;
                break;
            }
        }

        if (familySpending) {
            familySpending.spentAmount += amount;
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
