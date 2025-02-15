import { CategoryModel } from "../models/category-model.js";

//Returns all users in database
const getAllCategories = async () => {
    try {
        const data = await CategoryModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getCategoryById = async (id) => {
    try {
        const data = await CategoryModel.findById(id);
        if (!data) {
            const error = new Error("Kategorie nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createCategory = async (category) => {
    try {
        const newData = await CategoryModel.create(category);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        const deletedData = await CategoryModel.findByIdAndDelete(id);
        if (!deletedData) {
            const error = new Error("Kategorie nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }
        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateCategory = async (id, newData) => {
    try {
        const updatedData = await CategoryModel.findByIdAndUpdate(id, newData, {
            new: true,
        });
        if (!updatedData) {
            const error = new Error("Kategorie nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }
        return updatedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getAllGlobalCategories = async () => {
    try {
        const data = await CategoryModel.find({ isGlobal: true });
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getAllFamilyCategories = async (account) => {
    try {
        const data = await CategoryModel.find({ familyBudget: account });
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
    getAllGlobalCategories,
    getAllFamilyCategories,
};
