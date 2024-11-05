import { CategoryModel } from "../models/category-model.js";

//Returns all users in database
const getAllCategories = async (req, res) => {
    try {
        const data = await CategoryModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await CategoryModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Kategorie nebyla nalezena" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const existingData = await CategoryModel.findOne({
            name,
        });
        if (existingData) {
            return res.status(400).json({
                message: "Kategorie s tímto jménem již existuje",
            });
        }

        const newData = await CategoryModel.create({
            name,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await CategoryModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Kategorie nebyla nalezena" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await CategoryModel.findByIdAndUpdate(id, newData, {
            new: true,
        });

        if (!updatedData) {
            return res
                .status(404)
                .json({ message: "Kategorie nebyla nalezena" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
};
