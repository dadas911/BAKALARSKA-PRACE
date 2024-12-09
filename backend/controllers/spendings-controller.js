import { SpendingsModel } from "../models/spendings-model.js";
import { getBudgetById } from "./budget-controller.js";
import { getCategoryById } from "./category-controller.js";
import { getAccountById } from "./family-account-controller.js";
import { createNotification } from "./notification-controller.js";

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

        //Spent amount >= total amount -> generate notification
        if (updatedData.spentAmount > updatedData.totalAmount) {
            const budget = await getBudgetById(updatedData.budget);
            //Personal spending
            if (budget.__t === "PersonalBudget") {
                const currCategory = await getCategoryById(
                    updatedData.category
                );
                await createNotification({
                    name: "Překročení osobního výdajového plánu",
                    text:
                        'Překročili jste plán výdaje "' +
                        updatedData.name +
                        '" v kategorii "' +
                        currCategory.name +
                        '". Naplánovaná částka je ' +
                        updatedData.totalAmount +
                        ", vy jste již utratili " +
                        updatedData.spentAmount +
                        ".",
                    user: budget.user,
                });
            } else {
                const currCategory = await getCategoryById(
                    updatedData.category
                );
                const account = await getAccountById(budget.account);
                for (const userId of account.users) {
                    //SpentAmount > totalAmount -> create notification
                    await createNotification({
                        name: "Překročení rodinného výdajového plánu",
                        text:
                            'Překročili jste plán výdaje "' +
                            updatedData.name +
                            '" v kategorii "' +
                            currCategory.name +
                            '". Naplánovaná částka je ' +
                            updatedData.totalAmount +
                            ", rodina utratila již " +
                            updatedData.spentAmount +
                            ".",
                        user: userId,
                    });
                }
            }
        }

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

export {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
};
