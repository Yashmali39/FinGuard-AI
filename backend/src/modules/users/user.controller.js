import asyncHandler from "../../utils/asyncHandler.js";
import * as userService from "./user.service.js";

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: "Employee created successfully.",
    data: user,
  });
});