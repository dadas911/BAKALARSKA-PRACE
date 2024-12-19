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

/**
 * @swagger
 * /scholarships:
 *   get:
 *     summary: Získá všechny stipendia
 *     tags: [Scholarships]
 */
router.route("/").get(checkToken, handleGetAllScholarships);

/**
 * @swagger
 * /scholarships/{id}:
 *   get:
 *     summary: Získá stipendium podle ID
 *     tags: [Scholarships]
 */
router.route("/:id").get(checkToken, handleGetScholarshipById);

/**
 * @swagger
 * /scholarships:
 *   post:
 *     summary: Vytvoří nové stipendium
 *     tags: [Scholarships]
 */
router.route("/").post(checkToken, handleCreateScholarship);

/**
 * @swagger
 * /scholarships/{id}:
 *   delete:
 *     summary: Smaže stipendium podle ID
 *     tags: [Scholarships]
 */
router.route("/:id").delete(checkToken, handleDeleteScholarship);

/**
 * @swagger
 * /scholarships/{id}:
 *   put:
 *     summary: Aktualizuje stipendium podle ID
 *     tags: [Scholarships]
 */
router.route("/:id").put(checkToken, handleUpdateScholarship);

export default router;
