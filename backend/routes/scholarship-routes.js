import express from "express";

import {
    handleGetScholarshipById,
    handleGetAllScholarships,
    handleCreateScholarship,
    handleDeleteScholarship,
    handleUpdateScholarship,
} from "../handlers/scholarship-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/").get(checkToken, handleGetAllScholarships);
router.route("/:id").get(checkToken, handleGetScholarshipById);
router.route("/").post(checkToken, handleCreateScholarship);
router.route("/:id").delete(checkToken, handleDeleteScholarship);
router.route("/:id").put(checkToken, handleUpdateScholarship);

export default router;
