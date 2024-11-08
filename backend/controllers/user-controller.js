import { UserModel } from "../models/user-model.js";

//Returns all users in database
const getAllUsers = async () => {
    try {
        const data = await UserModel.find({});
        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

//Returns one user by id
const getUserById = async (id) => {
    try {
        const data = await UserModel.findById(id);

        if (!data) {
            const error = new Error("Uživatel nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }

        return data;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

//Creates new user in database
const createUser = async (user) => {
    try {
        const existingData = await UserModel.findOne({ email: user.email });

        if (existingData) {
            const error = new Error("Uživatel s tímto e-mailem již existuje");
            error.statusCode = 400;
            throw error;
        }

        const newData = await UserModel.create(user);

        return newData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const deletedData = await UserModel.findByIdAndDelete(id);

        if (!deletedData) {
            const error = new Error("Uživatel nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }

        return deletedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

const updateUser = async (id, newData) => {
    try {
        const updatedData = await UserModel.findByIdAndUpdate(id, newData, {
            new: true,
        });

        if (!updatedData) {
            const error = new Error("Uživatel nebyl nalezen");
            error.statusCode = 404;
            throw error;
        }
        return updatedData;
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        throw error;
    }
};

export { getAllUsers, getUserById, createUser, deleteUser, updateUser };
