import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user-controller.js";

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

    res.status(200).json(newData);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await deleteUser(id);
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
