import { SpendingsModel } from "../models/spendings-model.js";

const getAllSpendings = async () => {
    try {
        const data = await SpendingsModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getSpendingsById = async (id) => {
    try {
        const data = await SpendingsModel.findById(id);

        if (!data) {
            const error = new Error("Výdaje nebyly nalezeny");
            error.statusCode = 404;
            throw error;
        }

        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createSpendings = async (spending) => {
    try {
        const newData = await SpendingsModel.create(spending);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteSpendings = async (id) => {
    try {
        const deletedData = await SpendingsModel.findByIdAndDelete(id);

        if (!deletedData) {
            const error = new Error("Výdaje nebyly nalezeny");
            error.statusCode = 404;
            throw error;
        }

        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateSpendings = async (id, newData) => {
    try {
        const updatedData = await SpendingsModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            const error = new Error("Výdaje nebyly nalezeny");
            error.statusCode = 404;
            throw error;
        }

        return updatedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

//Helper function to recalculate spentAmount

export {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
};
