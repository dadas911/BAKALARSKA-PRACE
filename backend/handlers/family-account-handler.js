import {
    getAllAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount,
} from "../controllers/family-account-controller.js";
import { getUserById, updateUser } from "../controllers/user-controller.js";

const handleGetAllAccounts = async (req, res) => {
    try {
        const data = await getAllAccounts();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getAccountById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateAccount = async (req, res) => {
    try {
        const { name, owner, users } = req.body;
        const newData = await createAccount({ name, owner, users });

        //Add account_id to owner
        let user = await getUserById(owner);
        if (!user) {
            res.status(404).json({ message: "Vlastník účtu nebyl nalezen" });
        }
        user.familyAccount = newData._id;
        await updateUser(user._id, user);

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteAccount(id);
        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateAccount(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleHasFamilyAccount = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        const result = !!user.familyAccount;

        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json(data);
    }
};

export {
    handleGetAllAccounts,
    handleGetAccountById,
    handleCreateAccount,
    handleDeleteAccount,
    handleUpdateAccount,
    handleHasFamilyAccount,
};
