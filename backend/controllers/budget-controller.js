import { BudgetModel } from "../models/budget-model.js";
import { FamilyBudgetModel } from "../models/family-budget-model.js";
import { PersonalBudgetModel } from "../models/personal-budget-model.js";
import { getAllAccounts, updateAccount } from "./family-account-controller.js";
import { getAllUsers, updateUser } from "./user-controller.js";

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
        } else {
            data = await FamilyBudgetModel.findOne({
                account: id,
                month: month,
                year: year,
            });
        }

        if (!data) {
            const error = new Error("Rozpočet nebyl nalezen");
            error.statusCode = 400;
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

const resetBudgets = async () => {
    //Reset personal budgets -> user.personalBudget = null;
    const users = await getAllUsers();
    for (const user of users) {
        user.personalBudget = null;
        await updateUser(user._id, user);
    }

    //Reset family budgets -> familyAccount.familyBudget = null;
    const familyAccounts = await getAllAccounts();
    for (const account of familyAccounts) {
        account.familyBudget = null;
        await updateAccount(account._id, account);
    }
};

export {
    getAllBudgets,
    getBudgetById,
    updateBudget,
    getBudgetByIdAndDate,
    resetBudgets,
};
