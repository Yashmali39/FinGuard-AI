import { z } from "zod";

export const createTransactionSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(1, "Transaction ID is required"),

  referenceNumber: z
    .string()
    .trim()
    .min(1, "Reference number is required"),

  senderAccountNumber: z
    .string()
    .trim()
    .min(1, "Sender account number is required"),

  receiverAccountNumber: z
    .string()
    .trim()
    .min(1, "Receiver account number is required"),

  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0"),

  currency: z
    .string()
    .trim()
    .min(1, "Currency is required")
    .default("INR"),

  transactionType: z.enum(
    ["UPI", "IMPS", "NEFT", "RTGS", "CARD",],
    {
      errorMap: () => ({
        message: "Invalid transaction type",
      }),
    }
  ),

  deviceId: z
    .string()
    .trim()
    .min(1, "Device ID is required"),

  deviceType: z
  .string()
  .trim()
  .min(1, "Device type is required"),

  ipAddress: z
  .string()
  .trim()
  .min(1, "IP address is required"),
});