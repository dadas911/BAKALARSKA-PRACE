import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
} from "../controllers/user-controller.js";

import {
    getAccountById,
    updateAccount,
} from "../controllers/family-account-controller.js";
import { deletePersonalBudget } from "../controllers/personal-budget-controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

const handleGetUserInfo = async (req, res) => {
    try {
        const data = await getUserById(req.user._id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateUser = async (req, res) => {
    try {
        let {
            username,
            firstName,
            secondName,
            password,
            email,
            role,
            familyAccount,
        } = req.body;

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        password = await bcrypt.hash(password, salt);

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

const handleLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await getUserByEmail(email);
        const checkPassword = await bcrypt.compare(password, data.password);

        if (checkPassword) {
            const payload = {
                _id: data._id,
                username: data.username,
                firstName: data.firstName,
                secondName: data.secondName,
                email: data.email,
                password: data.password,
                role: data.role,
                familyAccount: data.familyAccount,
                personalBudget: data.personalBudget,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "12h",
            });
            res.status(200).json(token);
        } else {
            res.status(401).json({ message: "Nesprávné heslo" });
        }
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
    handleLoginUser,
    handleGetUserInfo,
};
