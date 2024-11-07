import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/user-controller.js";

import {
    getAccountById,
    updateAccount,
} from "../controllers/family-account-controller.js";
import { deletePersonalBudget } from "../controllers/personal-budget-controller.js";

const handleGetAllUsers = async (req, res) => {
    try {
        const data = await getAllUsers();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getUserById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateUser = async (req, res) => {
    try {
        const {
            username,
            firstName,
            secondName,
            password,
            email,
            role,
            familyAccount,
        } = req.body;

        const newData = await createUser({
            username,
            firstName,
            secondName,
            password,
            email,
            role,
            familyAccount,
        });

        //User has familyAcc -> add his _id to the acc
        if (familyAccount) {
            const account = await getAccountById(familyAccount);
            if (account) {
                account.users.push(newData._id);
                await updateAccount(account._id, account);
            } else {
                res.status(404).json({ message: "Rodinný účet nebyl nalezen" });
            }
        }

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteUser(id);

        //User has familyAcc -> delete his _id from it
        if (deletedData.familyAccount) {
            let acc = await getAccountById(deletedData.familyAccount);
            acc.users = acc.users.filter(
                (user_id) => user_id.toString() !== id
            );
            await updateAccount(acc._id, acc);
        }

        //User has created a budget -> delete it
        if (deletedData.personalBudget) {
            await deletePersonalBudget(deletedData.personalBudget);
        }

        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateUser(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export {
    handleGetAllUsers,
    handleGetUserById,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
};
