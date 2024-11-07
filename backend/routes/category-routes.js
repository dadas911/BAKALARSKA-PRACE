import express from "express";

import {
    handleGetAllCategories,
    handleGetCategoryById,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
} from "../handlers/category-handler.js";

const router = express.Router();

router.route("/").get(handleGetAllCategories);
router.route("/:id").get(handleGetCategoryById);
router.route("/").post(handleCreateCategory);
router.route("/:id").delete(handleDeleteCategory);
router.route("/:id").put(handleUpdateCategory);

export default router;
