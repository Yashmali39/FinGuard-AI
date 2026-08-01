import asyncHandler from "../../utils/asyncHandler.js";
import * as transactionService from "./transaction.service.js"
import parseCsv from "../../utils/parseCsv.js";

const saveTransaction = asyncHandler(async (req, res) => {
    const transaction = await transactionService.saveTransaction(req.body);

    res.status(201).json({
        success: true,
        message: "Transaction Saved Successfully",
        data: transaction,
    });
});

const getAllTransactions = asyncHandler(async (req, res) => {
    const result = await transactionService.getAllTransactions(req.query);

    res.status(200).json({
        success: true,
        message: "Transactions fetched successfully",
        data: result.transactions,
        pagination: result.pagination,
    });
})

const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await transactionService.getTransactionById(
        req.params.id
    );

    res.status(200).json({
        success: true,
        message: "Transaction fetched successfully",
        data: transaction,
    });

})

const uploadTransactions = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "CSV file is required");
    }

    const records = parseCsv(req.file.buffer);

    const result = await transactionService.uploadTransactions(records);

    res.status(200).json({
        success: true,
        message: "CSV processing completed",
        data: result,
    });
});

export {
    saveTransaction,
    getAllTransactions,
    getTransactionById,
    uploadTransactions,
};

