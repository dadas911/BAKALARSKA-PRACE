import express from "express";
import {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
} from "../handlers/user-handler.js";

const router = express.Router();

router.route("/").get(handleGetAllUsers);
router.route("/:id").get(handleGetUserById);
router.route("/").post(handleCreateUser);
router.route("/:id").delete(handleDeleteUser);
router.route("/:id").put(handleUpdateUser);

export default router;
