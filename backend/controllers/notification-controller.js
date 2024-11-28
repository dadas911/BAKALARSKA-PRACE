import { NotificationModel } from "../models/notification-model.js";

//Returns all users in database
const getAllUsersNotifications = async (userId) => {
    try {
        const data = await NotificationModel.find({ user: userId });
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const getNotificationById = async (id) => {
    try {
        const data = await NotificationModel.findById(id);
        if (!data) {
            const error = new Error("Notifikace nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const createNotification = async (notification) => {
    try {
        const newData = await NotificationModel.create(notification);
        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteNotification = async (id) => {
    try {
        const deletedData = await NotificationModel.findByIdAndDelete(id);
        if (!deletedData) {
            const error = new Error("Notifikace nebyla nalezena");
            error.statusCode = 404;
            throw error;
        }
        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateNotification = async (id, newData) => {
    try {
        const updatedData = await NotificationModel.findByIdAndUpdate(
            id,
            newData,
            {
                new: true,
            }
        );
        if (!updatedData) {
            const error = new Error("Notifikace nebyla nalezena");
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
    getAllUsersNotifications,
    getNotificationById,
    createNotification,
    deleteNotification,
    updateNotification,
};
