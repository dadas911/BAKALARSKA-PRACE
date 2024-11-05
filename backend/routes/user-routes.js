import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
} from "../controllers/user-controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);
router.route("/").post(createUser);
router.route("/:id").delete(deleteUser);
router.route("/:id").put(updateUser);

export default router;
