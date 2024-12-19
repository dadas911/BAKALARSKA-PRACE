import express from "express";

import {
    handleGetAllAccounts,
    handleGetAccountById,
    handleCreateAccount,
    handleDeleteAccount,
    handleUpdateAccount,
    handleHasFamilyAccount,
    handleGetAccount,
    handleAddUserToAccount,
    handleGetAllAccountUsers,
    handleDeleteUserFromAccount,
} from "../handlers/family-account-handler.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

/**
 * @swagger
 * /family-accounts/check:
 *   get:
 *     summary: Zkontroluje, zda má přihlášený uživatel rodinný účet
 *     tags: [FamilyAccounts]
 */
router.route("/check").get(checkToken, handleHasFamilyAccount);

/**
 * @swagger
 * /family-accounts/users:
 *   get:
 *     summary: Získá všechny uživatele rodinného účtu
 *     tags: [FamilyAccounts]
 */
router.route("/users").get(checkToken, handleGetAllAccountUsers);

/**
 * @swagger
 * /family-accounts/add:
 *   post:
 *     summary: Přidá uživatele do rodinného účtu
 *     tags: [FamilyAccounts]
 */
router.route("/add").post(checkToken, handleAddUserToAccount);

/**
 * @swagger
 * /family-accounts/remove:
 *   post:
 *     summary: Odebere uživatele z rodinného účtu
 *     tags: [FamilyAccounts]
 */
router.route("/remove").post(checkToken, handleDeleteUserFromAccount);

/**
 * @swagger
 * /family-accounts/info:
 *   get:
 *     summary: Získá informace o rodinném účtu
 *     tags: [FamilyAccounts]
 */
router.route("/info").get(checkToken, handleGetAccount);

/**
 * @swagger
 * /family-accounts:
 *   get:
 *     summary: Získá všechny rodinné účty
 *     tags: [FamilyAccounts]
 */
router.route("/").get(checkToken, handleGetAllAccounts);

/**
 * @swagger
 * /family-accounts/{id}:
 *   get:
 *     summary: Získá rodinný účet podle ID
 *     tags: [FamilyAccounts]
 */
router.route("/:id").get(checkToken, handleGetAccountById);

/**
 * @swagger
 * /family-accounts:
 *   post:
 *     summary: Vytvoří nový rodinný účet
 *     tags: [FamilyAccounts]
 */
router.route("/").post(checkToken, handleCreateAccount);

/**
 * @swagger
 * /family-accounts/{id}:
 *   delete:
 *     summary: Smaže rodinný účet podle ID
 *     tags: [FamilyAccounts]
 */
router.route("/:id").delete(checkToken, handleDeleteAccount);

/**
 * @swagger
 * /family-accounts/{id}:
 *   put:
 *     summary: Aktualizuje rodinný účet podle ID
 *     tags: [FamilyAccounts]
 */
router.route("/:id").put(checkToken, handleUpdateAccount);

export default router;
