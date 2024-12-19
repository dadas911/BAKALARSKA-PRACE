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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Získá seznam všech uživatelů
 *     tags: [Users]
 */
router.route("/").get(handleGetAllUsers);

/**
 * @swagger
 * /users/info:
 *   get:
 *     summary: Získá informace o přihlášeném uživateli
 *     tags: [Users]
 */
router.route("/info").get(checkToken, handleGetUser);

/**
 * @swagger
 * /users/role:
 *   post:
 *     summary: Zkontroluje roli přihlášeného uživatele
 *     tags: [Users]
 */
router.route("/role").post(checkToken, handleCheckUserRole);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Získá uživatele podle ID
 *     tags: [Users]
 */
router.route("/:id").get(checkToken, handleGetUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Vytvoří nového uživatele
 *     tags: [Users]
 */
router.route("/").post(handleCreateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Smaže uživatele podle ID
 *     tags: [Users]
 */
router.route("/:id").delete(checkToken, handleDeleteUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Aktualizuje uživatele podle ID
 *     tags: [Users]
 */
router.route("/:id").put(checkToken, handleUpdateUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Přihlásí uživatele
 *     tags: [Users]
 */
router.route("/login").post(handleLoginUser);

export default router;
