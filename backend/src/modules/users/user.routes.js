import express from "express";
import { createUser } from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUserSchema } from "./user.validation.js";
import verifyToken from "../../middleware/verifyToken.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    authorize("ADMIN"),
    validateRequest(createUserSchema),
    createUser
);

export default router;