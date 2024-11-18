import {
    getAccountById,
    updateAccount,
} from "../controllers/family-account-controller.js";
import {
    getAllFamilyBudgets,
    getFamilyBudgetById,
    createFamilyBudget,
    deleteFamilyBudget,
    updateFamilyBudget,
} from "../controllers/family-budget-controller.js";
import { getUserById } from "../controllers/user-controller.js";
import { getBudgetByIdAndDate } from "../controllers/budget-controller.js";

const handleGetAllFamilyBudgets = async (req, res) => {
    try {
        const data = await getAllFamilyBudgets();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetFamilyBudgetById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getFamilyBudgetById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateFamilyBudget = async (req, res) => {
    try {
        const { name, month, year, income, expense } = req.body;
        const user = await getUserById(req.user._id);
        const account = user.familyAccount;
        const newData = await createFamilyBudget({
            name,
            month,
            year,
            income,
            expense,
            account,
        });
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();

        //Add budget._id to FamilyAccount if its current month and year
        if (currMonth === month && currYear === year) {
            let familyAccount = await getAccountById(account);
            if (!familyAccount) {
                res.status(404).json({
                    message: "Vlastník rozpočtu nebyl nalezen",
                });
            }
            familyAccount.familyBudget = newData._id;
            await updateAccount(account, familyAccount);
        }

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteFamilyBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteFamilyBudget(id);
        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateFamilyBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateFamilyBudget(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetFamilyBudgetByMonth = async (req, res) => {
    try {
        const { month, year } = req.body;
        const user = await getUserById(req.user._id);
        const familyBudget = await getBudgetByIdAndDate(
            user.familyAccount,
            month,
            year,
            false
        );

        res.status(200).json(familyBudget);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleHasFamilyBudget = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        const familyAccount = await getAccountById(user.familyAccount);
        const result = !!familyAccount.familyBudget;

        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json(data);
    }
};

export {
    handleGetAllFamilyBudgets,
    handleGetFamilyBudgetById,
    handleCreateFamilyBudget,
    handleDeleteFamilyBudget,
    handleUpdateFamilyBudget,
    handleGetFamilyBudgetByMonth,
    handleHasFamilyBudget,
};
