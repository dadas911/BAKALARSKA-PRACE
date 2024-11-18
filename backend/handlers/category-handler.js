import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllGlobalCategories,
    getAllFamilyCategories,
} from "../controllers/category-controller.js";
import { getBudgetById } from "../controllers/budget-controller.js";
import { updateFamilyBudget } from "../controllers/family-budget-controller.js";
import { getUserById } from "../controllers/user-controller.js";
import { getAccountById } from "../controllers/family-account-controller.js";

const handleGetAllCategories = async (req, res) => {
    try {
        const data = await getAllCategories();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getCategoryById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateCategory = async (req, res) => {
    try {
        let { name, isGlobal, isExpense, familyBudget } = req.body;

        const user = await getUserById(req.user._id);
        const account = await getAccountById(user.familyAccount);
        familyBudget = account.familyBudget;

        const newData = await createCategory({
            name,
            isGlobal,
            isExpense,
            familyBudget,
        });

        if (familyBudget) {
            let budget = await getBudgetById(familyBudget);
            budget.categories.push(newData._id);
            await updateFamilyBudget(familyBudget, budget);
        }

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteCategory(id);

        if (deletedData.familyBudget) {
            let budget = await getBudgetById(deletedData.familyBudget);
            budget.categories = budget.categories.filter(
                (category_id) => category_id.toString() !== id
            );
            await updateFamilyBudget(budget._id, budget);
        }

        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateCategory(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetAllFamilyCategories = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        const globalCategories = await getAllGlobalCategories();
        const familyCategories = [];
        if (req.user.familyAccount) {
            const familyAccount = await getAccountById(user.familyAccount);
            const familyCategories = await getAllFamilyCategories(
                familyAccount.familyBudget
            );
        }

        res.status(200).json(globalCategories.concat(familyCategories));
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export {
    handleGetAllCategories,
    handleGetCategoryById,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    handleGetAllFamilyCategories,
};
