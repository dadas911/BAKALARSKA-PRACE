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
        const { name, month, year, familyIncome, account } = req.body;
        const newData = await createFamilyBudget({
            name,
            month,
            year,
            familyIncome,
            account,
        });

        //Add budget._id to FamilyAccount
        let familyAccount = await getAccountById(account);
        if (!familyAccount) {
            res.status(404).json({
                message: "Vlastník rozpočtu nebyl nalezen",
            });
        }
        familyAccount.familyBudget = newData._id;
        await updateAccount(account, familyAccount);

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

export {
    handleGetAllFamilyBudgets,
    handleGetFamilyBudgetById,
    handleCreateFamilyBudget,
    handleDeleteFamilyBudget,
    handleUpdateFamilyBudget,
};
