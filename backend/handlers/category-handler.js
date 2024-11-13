import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category-controller.js";
import { getBudgetById } from "../controllers/budget-controller.js";
import { updateFamilyBudget } from "../controllers/family-budget-controller.js";

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
        const { name, isGlobal, isExpense, familyBudget } = req.body;
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

export {
    handleGetAllCategories,
    handleGetCategoryById,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
};
