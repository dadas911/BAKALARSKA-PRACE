import express from "express";

import {
    handleGetAllCategories,
    handleGetCategoryById,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    handleGetAllFamilyCategories,
} from "../handlers/category-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.route("/family").get(checkToken, handleGetAllFamilyCategories);
router.route("/").get(checkToken, handleGetAllCategories);
router.route("/:id").get(checkToken, handleGetCategoryById);
router.route("/").post(checkToken, handleCreateCategory);
router.route("/:id").delete(checkToken, handleDeleteCategory);
router.route("/:id").put(checkToken, handleUpdateCategory);

export default router;
