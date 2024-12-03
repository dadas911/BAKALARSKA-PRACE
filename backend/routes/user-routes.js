import express from "express";
import {
    handleGetAllUsers,
    handleGetUserById,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
    handleLoginUser,
    handleGetUser,
    handleCheckUserRole,
} from "../handlers/user-handler.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/").get(handleGetAllUsers);
router.route("/info").get(checkToken, handleGetUser);
router.route("/role").post(checkToken, handleCheckUserRole);
router.route("/:id").get(checkToken, handleGetUserById);
router.route("/").post(handleCreateUser);
router.route("/:id").delete(checkToken, handleDeleteUser);
router.route("/:id").put(checkToken, handleUpdateUser);
router.route("/login").post(handleLoginUser);

export default router;
