import { ScholarshipModel } from "../models/scholarship-model.js";

const getAllScholarship = async () => {
    try {
        const data = await ScholarshipModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getScholarshipById = async (id) => {
    try {
        const data = await ScholarshipModel.findById(id);

        if (!data) {
            const error = new Error("Stipendium nebylo nazelezno");
            error.statusCode = 404;
            throw error;
        }

        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createScholarship = async (scholarship) => {
    try {
        const newData = await ScholarshipModel.create(scholarship);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteScholarship = async (id) => {
    try {
        const deletedData = await ScholarshipModel.findByIdAndDelete(id);

        if (!deletedData) {
            const error = new Error("Stipendium nebylo nazelezno");
            error.statusCode = 404;
            throw error;
        }

        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateScholarship = async (id, newData) => {
    try {
        const updatedData = await ScholarshipModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedData) {
            const error = new Error("Stipendium nebylo nazelezno");
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
    getAllScholarship,
    getScholarshipById,
    createScholarship,
    deleteScholarship,
    updateScholarship,
};
