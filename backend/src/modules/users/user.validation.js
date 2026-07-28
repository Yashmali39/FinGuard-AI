import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),

  role: z.enum(["ADMIN", "MANAGER", "ANALYST"], {
    errorMap: () => ({
      message: "Role must be ADMIN, MANAGER, or ANALYST.",
    }),
  }),

  department: z.enum(
    ["FRAUD_INVESTIGATION", "RISK_MANAGEMENT", "COMPLIANCE"],
    {
      errorMap: () => ({
        message:
          "Department must be FRAUD_INVESTIGATION, RISK_MANAGEMENT, or COMPLIANCE.",
      }),
    }
  ),
});