import { FinancialGoalModel } from "../models/financial-goal-model.js";

const getAllFinancialGoals = async () => {
    try {
        const data = await FinancialGoalModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getFinancialGoalById = async (id) => {
    try {
        const data = await FinancialGoalModel.findById(id);

        if (!data) {
            const error = new Error("Finanční cíl nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }

        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getFinancialGoalByBudgetId = async (id) => {
    try {
        const data = await FinancialGoalModel.find({ budget: id });
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createFinancialGoal = async (financialGoal) => {
    try {
        const newData = await FinancialGoalModel.create(financialGoal);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteFinancialGoal = async (id) => {
    try {
        const deletedData = await FinancialGoalModel.findByIdAndDelete(id);

        if (!deletedData) {
            const error = new Error("Finanční cíl nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }

        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateFinancialGoal = async (id, newData) => {
    try {
        const updatedData = await FinancialGoalModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            const error = new Error("Finanční cíl nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }

        return updatedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

export {
    getAllFinancialGoals,
    getFinancialGoalById,
    getFinancialGoalByBudgetId,
    createFinancialGoal,
    deleteFinancialGoal,
    updateFinancialGoal,
};
