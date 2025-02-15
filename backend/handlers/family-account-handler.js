import {
    getAllAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount,
} from "../controllers/family-account-controller.js";
import {
    getUserByEmail,
    getUserById,
    updateUser,
    getUsersByAccount,
} from "../controllers/user-controller.js";

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

const handleGetAccount = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        const data = await getAccountById(user.familyAccount);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
const handleCreateAccount = async (req, res) => {
    try {
        const { account, roles } = req.body;
        const name = account.name;
        const owner = req.user._id;
        const users = [req.user._id];
        const newData = await createAccount({ name, owner, users });

        //Add account_id to owner
        let user = await getUserById(owner);
        if (!user) {
            res.status(404).json({ message: "Vlastník účtu nebyl nalezen" });
        }
        user.familyAccount = newData._id;
        user.role = roles;
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
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleAddUserToAccount = async (req, res) => {
    try {
        const { email, roles } = req.body;
        const sender = await getUserById(req.user._id);
        const user = await getUserByEmail(email);
        //User is already part of some family account
        if (user.familyAccount) {
            res.status(404).json({
                message: "Uživatel je již členem rodinného účtu",
            });
        }

        const familyAccount = await getAccountById(sender.familyAccount);
        familyAccount.users.push(user._id);

        //Set family account + roles
        user.familyAccount = sender.familyAccount;
        user.role = roles;
        await updateAccount(familyAccount._id, familyAccount);
        await updateUser(user._id, user);
        const result = true;
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteUserFromAccount = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email);
        if (!user.familyAccount) {
            res.status(404).json({
                message: "Uživatel není členem žádného rodinného účtu",
            });
        }

        //Remove connection between user and family account + reset roles
        const familyAccount = await getAccountById(user.familyAccount);
        familyAccount.users = familyAccount.users.filter(
            (id) => id.toString() !== user._id.toString()
        );

        user.familyAccount = null;
        user.role = ["živitel", "člen domácnosti", "student", "senior"];
        await updateAccount(familyAccount._id, familyAccount);
        await updateUser(user._id, user);
        const result = true;

        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetAllAccountUsers = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        const data = await getUsersByAccount(user.familyAccount);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export {
    handleGetAllAccounts,
    handleGetAccountById,
    handleCreateAccount,
    handleDeleteAccount,
    handleUpdateAccount,
    handleHasFamilyAccount,
    handleGetAccount,
    handleAddUserToAccount,
    handleDeleteUserFromAccount,
    handleGetAllAccountUsers,
};
