import { PersonalBudgetModel } from "../models/personal-budget-model.js";

//Returns all users in database
const getAllPersonalBudgets = async (req, res) => {
    try {
        const data = await PersonalBudgetModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPersonalBudgetById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await PersonalBudgetModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Osobní rozpočet nebyl nalezen" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPersonalBudget = async (req, res) => {
    try {
        const { name, month, year, personalIncome, flexibility, weight, user } =
            req.body;

        const existingData = await PersonalBudgetModel.findOne({
            year,
            month,
            user,
        });
        if (existingData) {
            return res.status(400).json({
                message:
                    "Osobní rozpočet pro uživatele v tomto datu již existuje",
            });
        }

        const newData = await PersonalBudgetModel.create({
            name,
            month,
            year,
            personalIncome,
            flexibility,
            weight,
            user,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePersonalBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await PersonalBudgetModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Osobní rozpočet nebyl nalezen" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePersonalBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await PersonalBudgetModel.findByIdAndUpdate(
            id,
            newData,
            {
                new: true,
            }
        );

        if (!updatedData) {
            return res
                .status(404)
                .json({ message: "Osobní rozpočet nebyl nalezen" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllPersonalBudgets,
    getPersonalBudgetById,
    createPersonalBudget,
    deletePersonalBudget,
    updatePersonalBudget,
};
