import express from "express";

import {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
} from "../controllers/spendings-controller.js";

const router = express.Router();

router.route("/").get(getAllSpendings);
router.route("/:id").get(getSpendingsById);
router.route("/").post(createSpendings);
router.route("/:id").delete(deleteSpendings);
router.route("/:id").put(updateSpendings);

export default router;
