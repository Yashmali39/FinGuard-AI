import express from "express";
import { saveTransaction, getAllTransactions, getTransactionById } from "./transaction.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createTransactionSchema } from "./transaction.validation.js";
import authorize from "../../middleware/authorize.js";
import verifyToken from "../../middleware/verifyToken.js";
import csvUpload from "../../middleware/upload.js";
import { uploadTransactions } from "./transaction.controller.js";

const router = express.Router();

router.post(
    "/",
    validateRequest(createTransactionSchema),
    saveTransaction
);

router.post(
    "/upload",
    verifyToken,
    authorize("ADMIN", "MANAGER"),
    csvUpload.single("file"),
    uploadTransactions
);

router.get(
    "/",
    verifyToken,
    authorize("ADMIN", "MANAGER", "ANALYST"),
    getAllTransactions
);

router.get(
    "/:id",
    verifyToken,
    authorize("ADMIN", "MANAGER", "ANALYST"),
    getTransactionById,

)


export default router;