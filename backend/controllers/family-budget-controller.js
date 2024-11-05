import { FamilyBudgetModel } from "../models/family-budget-model.js";

//Returns all users in database
const getAllFamilyBudgets = async (req, res) => {
    try {
        const data = await FamilyBudgetModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFamilyBudgetById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await FamilyBudgetModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Rodinný rozpočet nebyl nalezen" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFamilyBudget = async (req, res) => {
    try {
        const { name, month, year, familyIncome, account } = req.body;

        const existingData = await FamilyBudgetModel.findOne({
            month,
            year,
            account,
        });
        if (existingData) {
            return res.status(400).json({
                message: "Rodinný rozpočet pro účet v tomto datu již existuje",
            });
        }

        const newData = await FamilyBudgetModel.create({
            name,
            month,
            year,
            familyIncome,
            account,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFamilyBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await FamilyBudgetModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Rodinný rozpočet nebyl nalezen" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFamilyBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await FamilyBudgetModel.findByIdAndUpdate(
            id,
            newData,
            {
                new: true,
            }
        );

        if (!updatedData) {
            return res
                .status(404)
                .json({ message: "Rodinný rozpočet nebyl nalezen" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllFamilyBudgets,
    getFamilyBudgetById,
    createFamilyBudget,
    deleteFamilyBudget,
    updateFamilyBudget,
};
