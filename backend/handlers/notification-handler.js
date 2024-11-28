import {
    getAllUsersNotifications,
    getNotificationById,
    createNotification,
    deleteNotification,
    updateNotification,
} from "../controllers/notification-controller.js";

const handleGetAllUsersNotification = async (req, res) => {
    try {
        const data = await getAllUsersNotifications(req.user._id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleGetNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getNotificationById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleCreateNotification = async (req, res) => {
    try {
        let { name, text, user } = req.body;

        user = req.user._id;

        const newData = await createNotification({
            name,
            text,
            user,
        });

        res.status(200).json(newData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleDeleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await deleteNotification(id);

        res.status(200).json(deletedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const handleUpdateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedData = await updateNotification(id, newData);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export {
    handleGetAllUsersNotification,
    handleGetNotificationById,
    handleCreateNotification,
    handleDeleteNotification,
    handleUpdateNotification,
};
