import prisma from "../../lib/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { createTransactionSchema } from "./transaction.validation.js";

const saveTransaction = async (transactionData) => {
    const existingTransaction = await prisma.transaction.findFirst({
        where: {
            OR: [
                { transactionId: transactionData.transactionId },
                { referenceNumber: transactionData.referenceNumber }
            ]
        }
    });

    if (existingTransaction) {
        if (existingTransaction.transactionId === transactionData.transactionId) {
            throw new ApiError(409, "Transaction ID already exists");
        }

        if (existingTransaction.referenceNumber === transactionData.referenceNumber) {
            throw new ApiError(409, "Reference number already exists");
        }
    }

    const transaction = await prisma.transaction.create({
        data: {
            transactionId: transactionData.transactionId,
            referenceNumber: transactionData.referenceNumber,
            senderAccountNumber: transactionData.senderAccountNumber,
            receiverAccountNumber: transactionData.receiverAccountNumber,
            amount: transactionData.amount,
            currency: transactionData.currency,
            transactionType: transactionData.transactionType,
            deviceId: transactionData.deviceId,
            deviceType: transactionData.deviceType,
            ipAddress: transactionData.ipAddress,
            city: "Unknown",
            state: "Unknown",
            country: "Unknown",
            status: "PENDING",
        },
    });

    return transaction;
};

const getAllTransactions = async (query) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
        search,
        status,
        transactionType,
        currency,
        minAmount,
        maxAmount,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {};

    // Search
    if (search) {
        where.OR = [
            {
                transactionId: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                referenceNumber: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                senderAccountNumber: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                receiverAccountNumber: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }

    // Filters
    if (status) {
        where.status = status;
    }

    if (transactionType) {
        where.transactionType = transactionType;
    }

    if (currency) {
        where.currency = currency;
    }

    if (minAmount || maxAmount) {
        where.amount = {};

        if (minAmount) {
            where.amount.gte = Number(minAmount);
        }

        if (maxAmount) {
            where.amount.lte = Number(maxAmount);
        }
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: {
            [sortBy]: order,
        },
        skip,
        take: Number(limit),
    });

    const total = await prisma.transaction.count({
        where,
    });

    return {
        transactions,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

const getTransactionById = async (id) => {
    const transaction = await prisma.transaction.findUnique({
        where: {
            id,
        },
    });

    if (!transaction) {
        throw new ApiError(404, "Transaction not found");
    }

    return transaction;
};

const validateCsvTransactions = (records) => {
    const validTransactions = [];
    const invalidTransactions = [];

    records.forEach((record, index) => {

        // CSV values are strings, so transform values
        // that our application expects as other types.
        const transformedRecord = {
            ...record,
            amount: Number(record.amount),
        };

        const result = createTransactionSchema.safeParse(
            transformedRecord
        );

        if (!result.success) {
            invalidTransactions.push({
                row: index + 2,
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });

            return;
        }

        validTransactions.push(result.data);
    });

    return {
        validTransactions,
        invalidTransactions,
    };
};

const filterDuplicateTransactions = async (transactions) => {
    if (transactions.length === 0) {
        return {
            uniqueTransactions: [],
            duplicateTransactions: [],
        };
    }

    const transactionIds = transactions.map(
        (transaction) => transaction.transactionId
    );

    const referenceNumbers = transactions.map(
        (transaction) => transaction.referenceNumber
    );

    const existingTransactions = await prisma.transaction.findMany({
        where: {
            OR: [
                {
                    transactionId: {
                        in: transactionIds,
                    },
                },
                {
                    referenceNumber: {
                        in: referenceNumbers,
                    },
                },
            ],
        },
        select: {
            transactionId: true,
            referenceNumber: true,
        },
    });

    const existingTransactionIds = new Set(
        existingTransactions.map(
            (transaction) => transaction.transactionId
        )
    );

    const existingReferenceNumbers = new Set(
        existingTransactions.map(
            (transaction) => transaction.referenceNumber
        )
    );

    const uniqueTransactions = [];
    const duplicateTransactions = [];

    const seenTransactionIds = new Set(existingTransactionIds);
    const seenReferenceNumbers = new Set(existingReferenceNumbers);

    for (const transaction of transactions) {
        const isDuplicate =
            seenTransactionIds.has(transaction.transactionId) ||
            seenReferenceNumbers.has(transaction.referenceNumber);

        if (isDuplicate) {
            duplicateTransactions.push(transaction);
            continue;
        }

        uniqueTransactions.push(transaction);

        seenTransactionIds.add(transaction.transactionId);
        seenReferenceNumbers.add(transaction.referenceNumber);
    }

    return {
        uniqueTransactions,
        duplicateTransactions,
    };
};

const insertTransactions = async (transactions) => {
    if (transactions.length === 0) {
        return 0;
    }

    const transactionsToInsert = transactions.map((transaction) => ({
        ...transaction,

        city: "Unknown",
        state: "Unknown",
        country: "Unknown",

        status: "PENDING",
    }));

    const result = await prisma.transaction.createMany({
        data: transactionsToInsert,
        skipDuplicates: true,
    });

    return result.count;
};

const uploadTransactions = async (records) => {
    const {
        validTransactions,
        invalidTransactions,
    } = validateCsvTransactions(records);

    const {
        uniqueTransactions,
        duplicateTransactions,
    } = await filterDuplicateTransactions(validTransactions);

    const insertedCount = await insertTransactions(
        uniqueTransactions
    );

    return {
        totalRows: records.length,
        validRows: validTransactions.length,
        invalidRows: invalidTransactions.length,
        duplicateRows: duplicateTransactions.length,
        insertedRows: insertedCount,
        errors: invalidTransactions,
    };
};


export {
    saveTransaction,
    getAllTransactions,
    getTransactionById,
    uploadTransactions
};