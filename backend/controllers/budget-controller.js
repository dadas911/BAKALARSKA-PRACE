import { BudgetModel } from "../models/budget-model.js";

//Returns all users in database
const getAllBudgets = async () => {
    try {
        const data = await BudgetModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getBudgetById = async (id) => {
    try {
        const data = await BudgetModel.findById(id);
        if (!data) {
            const error = new Error("Rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getBudgetByIdAndDate = async (user, month, year) => {
    try {
        const data = await BudgetModel.findOne({
            user: user,
            month: month,
            year: year,
        });
        if (!data) {
            const error = new Error("Rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateBudget = async (id, newData) => {
    try {
        const updatedData = await BudgetModel.findByIdAndUpdate(id, newData, {
            new: true,
        });
        if (!updatedData) {
            const error = new Error("Rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return updatedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

export { getAllBudgets, getBudgetById, updateBudget, getBudgetByIdAndDate };
