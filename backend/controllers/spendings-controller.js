import { SpendingsModel } from "../models/spendings-model.js";

const getAllSpendings = async (req, res) => {
    try {
        const data = await SpendingsModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSpendingsById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await SpendingsModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Výdaje nebyly nalezeny" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSpendings = async (req, res) => {
    try {
        const { name, totalAmount, spendAmount, budget, category } = req.body;

        const newData = await SpendingsModel.create({
            name,
            totalAmount,
            spendAmount,
            budget,
            category,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSpendings = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await SpendingsModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Výdaje nebyly nalezeny" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSpendings = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await SpendingsModel.findByIdAndUpdate(
            id,
            newData,
            {
                new: true,
            }
        );

        if (!updatedData) {
            return res.status(404).json({ message: "Výdaje nebyly nalezeny" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
};
