import { BudgetModel } from "../models/budget-model.js";
import { FamilyBudgetModel } from "../models/family-budget-model.js";
import { PersonalBudgetModel } from "../models/personal-budget-model.js";

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

const getBudgetByIdAndDate = async (id, month, year, isPersonalBudget) => {
    try {
        let data = null;
        if (isPersonalBudget) {
            data = await PersonalBudgetModel.findOne({
                user: id,
                month: month,
                year: year,
            });
            //console.log("Personal data: " + JSON.stringify(data));
        } else {
            data = await FamilyBudgetModel.findOne({
                account: id,
                month: month,
                year: year,
            });
            //console.log("Family data: " + JSON.stringify(data));
        }

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
