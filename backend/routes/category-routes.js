import express from "express";

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
} from "../controllers/category-controller.js";

const router = express.Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);
router.route("/").post(createCategory);
router.route("/:id").delete(deleteCategory);
router.route("/:id").put(updateCategory);

export default router;
