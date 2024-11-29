import { ScholarshipModel } from "../models/scholarship-model.js";
import { getBudgetById } from "./budget-controller.js";
import { createNotification } from "./notification-controller.js";
import { getPersonalBudgetById } from "./personal-budget-controller.js";
import { getUserById } from "./user-controller.js";

const getAllScholarship = async () => {
    try {
        const data = await ScholarshipModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getScholarshipByBudgetId = async (budgetId) => {
    try {
        const data = await ScholarshipModel.find({ personalBudget: budgetId });
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

const checkScholarshipsNotifyDate = async () => {
    try {
        const scholarships = await getAllScholarship();
        const currDate = new Date();
        const currDay = currDate.getDate();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();

        for (const scholarship of scholarships) {
            if (scholarship.notifyDate) {
                const notifyDate = new Date(scholarship.notifyDate);
                const day = notifyDate.getDate();
                const month = notifyDate.getMonth() + 1;
                const year = notifyDate.getFullYear();
                if (
                    day === currDay &&
                    month === currMonth &&
                    year === currYear
                ) {
                    const pBudget = await getPersonalBudgetById(
                        scholarship.personalBudget
                    );
                    const user = await getUserById(pBudget.user);
                    await createNotification({
                        name: "Stipendium - upozornění",
                        text:
                            "Blíží se konečný termín zažádání o toto stipendium: " +
                            scholarship.name +
                            ". Nezapomeňte podat svou žádost.",
                        user: user._id,
                    });
                }
            }
        }
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

export {
    getAllScholarship,
    getScholarshipByBudgetId,
    getScholarshipById,
    createScholarship,
    deleteScholarship,
    updateScholarship,
    checkScholarshipsNotifyDate,
};
