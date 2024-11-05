import { TransactionModel } from "../models/transaction-model.js";

const getAllTransactions = async (req, res) => {
    try {
        const data = await TransactionModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await TransactionModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Transakce nebyla nalezena" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTransaction = async (req, res) => {
    try {
        const { name, amount, date, description, personalBudget, category } =
            req.body;

        const newData = await TransactionModel.create({
            name,
            amount,
            date,
            description,
            personalBudget,
            category,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await TransactionModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Transakce nebyla nalezena" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await TransactionModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            return res
                .status(404)
                .json({ message: "Transakce nebyla nalezena" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateTransaction,
};
