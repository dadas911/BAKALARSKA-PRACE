import { TransactionModel } from "../models/transaction-model.js";

const getAllTransactions = async () => {
    try {
        const data = await TransactionModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getTransactionById = async (id) => {
    try {
        const data = await TransactionModel.findById(id);

        if (!data) {
            const error = new Error("Transakce nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }

        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createTransaction = async (transaction) => {
    try {
        const newData = await TransactionModel.create(transaction);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteTransaction = async (id) => {
    try {
        const deletedData = await TransactionModel.findByIdAndDelete(id);

        if (!deletedData) {
            const error = new Error("Transakce nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }

        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateTransaction = async (id, newData) => {
    try {
        const updatedData = await TransactionModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            const error = new Error("Transakce nebyla nalezena");
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
    getAllTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateTransaction,
};
