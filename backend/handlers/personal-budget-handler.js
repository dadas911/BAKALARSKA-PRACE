import {
    getAllPersonalBudgets,
    getPersonalBudgetById,
    createPersonalBudget,
    deletePersonalBudget,
    updatePersonalBudget,
} from "../controllers/personal-budget-controller.js";
import { getBudgetByIdAndDate } from "../controllers/budget-controller.js";
import { getUserById, updateUser } from "../controllers/user-controller.js";

const handleGetAllPersonalBudgets = async (req, res) => {
    try {
        const data = await getAllPersonalBudgets();
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetPersonalBudgetById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getPersonalBudgetById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreatePersonalBudget = async (req, res) => {
    try {
        const user = req.user._id;
        const { name, month, year, income, expense, flexibility, weight } =
            req.body;
        const newData = await createPersonalBudget({
            name,
            month,
            year,
            income,
            expense,
            flexibility,
            weight,
            user,
        });
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();

        //Add budget._id to User if its current month and year
        if (currMonth === month && currYear === year) {
            let budgetOwner = await getUserById(user);
            if (!budgetOwner) {
                res.status(404).json({
                    message: "Vlastník rozpočtu nebyl nalezen",
                });
            }
            budgetOwner.personalBudget = newData._id;
            await updateUser(user, budgetOwner);
        }

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeletePersonalBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deletePersonalBudget(id);
        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdatePersonalBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updatePersonalBudget(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetPersonalBudgetByMonth = async (req, res) => {
    try {
        const { month, year } = req.body;
        const personalBudget = await getBudgetByIdAndDate(
            req.user._id,
            month,
            year
        );

        res.status(200).json(personalBudget);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export {
    handleGetAllPersonalBudgets,
    handleGetPersonalBudgetById,
    handleCreatePersonalBudget,
    handleDeletePersonalBudget,
    handleUpdatePersonalBudget,
    handleGetPersonalBudgetByMonth,
};
