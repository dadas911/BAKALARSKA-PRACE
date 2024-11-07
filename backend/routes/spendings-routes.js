import express from "express";

import {
    handleGetAllSpendings,
    handleGetSpendingsById,
    handleCreateSpendings,
    handleDeleteSpendings,
    handleUpdateSpendings,
} from "../handlers/spedings-handler.js";

const router = express.Router();

router.route("/").get(handleGetAllSpendings);
router.route("/:id").get(handleGetSpendingsById);
router.route("/").post(handleCreateSpendings);
router.route("/:id").delete(handleDeleteSpendings);
router.route("/:id").put(handleUpdateSpendings);

export default router;
