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

/**
 * @swagger
 * /categories/family:
 *   get:
 *     summary: Získá všechny kategorie pro rodinný účet
 *     tags: [Categories]
 */
router.route("/family").get(checkToken, handleGetAllFamilyCategories);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Získá všechny kategorie
 *     tags: [Categories]
 */
router.route("/").get(checkToken, handleGetAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Získá kategorii podle ID
 *     tags: [Categories]
 */
router.route("/:id").get(checkToken, handleGetCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Vytvoří novou kategorii
 *     tags: [Categories]
 */
router.route("/").post(checkToken, handleCreateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Smaže kategorii podle ID
 *     tags: [Categories]
 */
router.route("/:id").delete(checkToken, handleDeleteCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Aktualizuje kategorii podle ID
 *     tags: [Categories]
 */
router.route("/:id").put(checkToken, handleUpdateCategory);

export default router;
