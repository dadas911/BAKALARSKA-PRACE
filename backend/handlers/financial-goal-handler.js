import {
    getBudgetById,
    getBudgetByIdAndDate,
    updateBudget,
} from "../controllers/budget-controller.js";
import { getAccountById } from "../controllers/family-account-controller.js";
import {
    getFinancialGoalById,
    createFinancialGoal,
    deleteFinancialGoal,
    updateFinancialGoal,
} from "../controllers/financial-goal-controller.js";
import { getUserById } from "../controllers/user-controller.js";

const handleGetFinancialGoalById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getFinancialGoalById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetPersonalFinancialGoals = async (req, res) => {
    try {
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();

        const pBudget = await getBudgetByIdAndDate(
            req.user._id,
            currMonth,
            currYear,
            true
        );

        const financialGoals = await Promise.all(
            pBudget.financialGoals.map(async (id) => {
                return await getFinancialGoalById(id);
            })
        );

        res.status(200).json(financialGoals);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetFamilyFinancialGoals = async (req, res) => {
    try {
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();
        const user = await getUserById(req.user._id);

        const fBudget = await getBudgetByIdAndDate(
            user.familyAccount,
            currMonth,
            currYear,
            false
        );

        const financialGoals = await Promise.all(
            fBudget.financialGoals.map(async (id) => {
                return await getFinancialGoalById(id);
            })
        );

        res.status(200).json(financialGoals);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateFinancialGoal = async (req, res) => {
    try {
        let { name, neededAmount, currentAmount, dueDate, isPersonal } =
            req.body;
        const user = await getUserById(req.user._id);
        let budget = "";
        if (isPersonal) {
            budget = user.personalBudget;
        } else {
            const familyAccount = await getAccountById(user.familyAccount);
            budget = familyAccount.familyBudget;
        }

        const newData = await createFinancialGoal({
            name,
            neededAmount,
            currentAmount,
            dueDate,
            budget,
        });

        const budgetData = await getBudgetById(budget);
        if (!budgetData) {
            res.status(404).json({ message: "Rozpočet nebyl nalezen" });
        }
        budgetData.financialGoals.push(newData._id);
        await updateBudget(budget, budgetData);

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

const handleDeleteFinancialGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteFinancialGoal(id);
        if (deletedData.budget) {
            let budget = await getBudgetById(deletedData.budget);
            budget.financialGoals = budget.financialGoals.filter(
                (financialGoal_id) => financialGoal_id.toString() !== id
            );
            await updateBudget(budget._id, budget);
        }

        res.status(200).json(deletedData);
    } catch (error) {}
};

const handleUpdateFinancialGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateFinancialGoal(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

export {
    handleGetFinancialGoalById,
    handleGetPersonalFinancialGoals,
    handleGetFamilyFinancialGoals,
    handleCreateFinancialGoal,
    handleDeleteFinancialGoal,
    handleUpdateFinancialGoal,
};
