import { FamilyAccountModel } from "../models/family-account-model.js";

const getAllAccounts = async (req, res) => {
    try {
        const data = await FamilyAccountModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await FamilyAccountModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Účet nebyl nalezen" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAccount = async (req, res) => {
    try {
        const { name, owner, users } = req.body;
        const existingData = await FamilyAccountModel.findOne({ owner });

        if (existingData) {
            return res
                .status(400)
                .json({ message: "Účet s tímto vlastníkem již existuje" });
        }

        const newData = await FamilyAccountModel.create({
            name,
            owner,
            users,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await FamilyAccountModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Účet nebyl nalezen" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await FamilyAccountModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: "Účet nebyl nalezen" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount,
};
