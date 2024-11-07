import { FamilyBudgetModel } from "../models/family-budget-model.js";

//Returns all users in database
const getAllFamilyBudgets = async () => {
    try {
        const data = await FamilyBudgetModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getFamilyBudgetById = async (id) => {
    try {
        const data = await FamilyBudgetModel.findById(id);
        if (!data) {
            const error = new Error("Rodinný rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createFamilyBudget = async (budget) => {
    try {
        const existingData = await FamilyBudgetModel.findOne({
            month: budget.month,
            year: budget.year,
            account: budget.account,
        });
        if (existingData) {
            const error = new Error(
                "Rodinný rozpočet pro účet v tomto datu již existuje"
            );
            error.statusCode = 400;
            throw error;
        }
        const newData = await FamilyBudgetModel.create(budget);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteFamilyBudget = async (id) => {
    try {
        const data = await FamilyBudgetModel.findByIdAndDelete(id);
        if (!data) {
            const error = new Error("Rodinný rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateFamilyBudget = async (id, newData) => {
    try {
        const updatedData = await FamilyBudgetModel.findByIdAndUpdate(
            id,
            newData,
            {
                new: true,
            }
        );
        if (!updatedData) {
            const error = new Error("Rodinný rozpočet nebyl nalezen");
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
    getAllFamilyBudgets,
    getFamilyBudgetById,
    createFamilyBudget,
    deleteFamilyBudget,
    updateFamilyBudget,
};
