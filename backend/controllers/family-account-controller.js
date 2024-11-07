import { FamilyAccountModel } from "../models/family-account-model.js";

const getAllAccounts = async () => {
    try {
        const data = await FamilyAccountModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getAccountById = async (id) => {
    try {
        const data = await FamilyAccountModel.findById(id);
        if (!data) {
            const error = new Error("Účet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createAccount = async (account) => {
    try {
        const existingData = await FamilyAccountModel.findOne({
            owner: account.owner,
        });

        if (existingData) {
            const error = new Error("Účet s tímto vlastníkem již existuje");
            error.statusCode = 400;
            throw error;
        }

        const newData = await FamilyAccountModel.create(account);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteAccount = async (id) => {
    try {
        const deletedData = await FamilyAccountModel.findByIdAndDelete(id);

        if (!deletedData) {
            const error = new Error("Účet nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }

        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateAccount = async (id, newData) => {
    try {
        const updatedData = await FamilyAccountModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            const error = new Error("Účet nebyl nalezen");
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
    getAllAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount,
};
