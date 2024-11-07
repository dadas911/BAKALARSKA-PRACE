import { PersonalBudgetModel } from "../models/personal-budget-model.js";

//Returns all users in database
const getAllPersonalBudgets = async () => {
    try {
        const data = await PersonalBudgetModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getPersonalBudgetById = async (id) => {
    try {
        const data = await PersonalBudgetModel.findById(id);
        if (!data) {
            const error = new Error("Osobní rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createPersonalBudget = async (budget) => {
    try {
        const existingData = await PersonalBudgetModel.findOne({
            year: budget.year,
            month: budget.month,
            user: budget.user,
        });
        if (existingData) {
            const error = new Error(
                "Osobní rozpočet pro uživatele v tomto datu již existuje"
            );
            error.statusCode = 400;
            throw error;
        }
        const newData = await PersonalBudgetModel.create(budget);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deletePersonalBudget = async (id) => {
    try {
        const deletedData = await PersonalBudgetModel.findByIdAndDelete(id);
        if (!deletedData) {
            const error = new Error("Osobní rozpočet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updatePersonalBudget = async (id, newData) => {
    try {
        console.log("Received data: " + newData);
        const updatedData = await PersonalBudgetModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );
        if (!updatedData) {
            const error = new Error("Osobní rozpočet nebyl nalezen");
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
    getAllPersonalBudgets,
    getPersonalBudgetById,
    createPersonalBudget,
    deletePersonalBudget,
    updatePersonalBudget,
};
