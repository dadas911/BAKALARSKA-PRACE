import { UserModel } from "../models/user-model.js";

//Returns all users in database
const getAllUsers = async (req, res) => {
    try {
        const data = await UserModel.find({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await UserModel.findById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Uživatel nebyl nalezen" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, firstName, secondName, password, email, role } =
            req.body;

        const existingData = await UserModel.findOne({ email });
        if (existingData) {
            return res
                .status(400)
                .json({ message: "Uživatel s tímto e-mailem již existuje" });
        }

        const newData = await UserModel.create({
            username,
            firstName,
            secondName,
            password,
            email,
            role,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await UserModel.findByIdAndDelete(id);

        if (!data) {
            res.status(404).json({ message: "Uživatel nebyl nalezen" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const newData = req.body;

        const updatedData = await UserModel.findByIdAndUpdate(id, newData, {
            new: true,
        });

        if (!updatedData) {
            return res.status(404).json({ message: "Uživatel nebyl nalezen" });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllUsers, getUserById, createUser, deleteUser, updateUser };
