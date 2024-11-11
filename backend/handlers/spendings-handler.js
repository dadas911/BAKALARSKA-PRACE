import {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
} from "../controllers/spendings-controller.js";

import {
    getBudgetById,
    updateBudget,
} from "../controllers/budget-controller.js";

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
        const { name, totalAmount, spentAmount, budget, category } = req.body;
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

        res.status(200).json(newData);
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

export {
    handleGetAllSpendings,
    handleGetSpendingsById,
    handleCreateSpendings,
    handleDeleteSpendings,
    handleUpdateSpendings,
};
