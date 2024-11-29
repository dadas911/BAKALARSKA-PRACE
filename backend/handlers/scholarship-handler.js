import {
    getBudgetById,
    getBudgetByIdAndDate,
} from "../controllers/budget-controller.js";
import { updatePersonalBudget } from "../controllers/personal-budget-controller.js";
import {
    getScholarshipById,
    createScholarship,
    deleteScholarship,
    updateScholarship,
    getScholarshipByBudgetId,
} from "../controllers/scholarship-controller.js";
import { getUserById } from "../controllers/user-controller.js";

const handleGetScholarshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getScholarshipById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetAllScholarships = async (req, res) => {
    try {
        const currDate = new Date();
        const currMonth = currDate.getMonth() + 1;
        const currYear = currDate.getFullYear();

        const pBudget = await getBudgetByIdAndDate(
            req.user._id,
            currMonth,
            currYear,
            true
        );

        const scholarships = await getScholarshipByBudgetId(pBudget._id);
        res.status(200).json(scholarships);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateScholarship = async (req, res) => {
    try {
        let { name, amount, submissionDate, notifyDate } = req.body;
        const user = await getUserById(req.user._id);
        const personalBudget = user.personalBudget;
        const budgetData = await getBudgetById(personalBudget);

        if (!budgetData) {
            res.status(404).json({ message: "Rozpočet nebyl nalezen" });
        }

        const newData = await createScholarship({
            name,
            amount,
            submissionDate,
            notifyDate,
            personalBudget,
        });

        budgetData.scholarships.push(newData._id);
        await updatePersonalBudget(personalBudget, budgetData);

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

const handleDeleteScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteScholarship(id);

        if (deletedData.personalBudget) {
            let budget = await getBudgetById(deletedData.personalBudget);
            budget.scholarships = budget.scholarships.filter(
                (scholarship_id) => scholarship_id.toString() !== id
            );
            await updatePersonalBudget(budget._id, budget);
        }

        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

const handleUpdateScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateScholarship(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

export {
    handleGetScholarshipById,
    handleGetAllScholarships,
    handleCreateScholarship,
    handleDeleteScholarship,
    handleUpdateScholarship,
};
