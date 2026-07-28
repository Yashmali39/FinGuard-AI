import { Router } from "express";
import { login } from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { loginSchema } from "./auth.validation.js";
import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.post(
  "/login",
  validateRequest(loginSchema),
  login
);

router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;