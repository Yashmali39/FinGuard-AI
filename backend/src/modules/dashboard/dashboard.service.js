import prisma from "../../lib/prisma.js";
import ApiError from "../../utils/ApiError.js";


const dashboardSummary = async () => {

    const [
        totalTransactions,
        fraudTransactions,
        pendingCases,
        resolvedCases
    ] = await Promise.all([

        prisma.transaction.count(),

        prisma.riskAssessment.count({
            where: {
                prediction: "FRAUD"
            }
        }),

        prisma.fraudCase.count({
            where: {
                status: {
                    not: "CLOSED"
                }
            }
        }),

        prisma.fraudCase.count({
            where: {
                status: "CLOSED"
            }
        })

    ]);

    const fraudRate =
        totalTransactions > 0
            ? Number(
                ((fraudTransactions / totalTransactions) * 100).toFixed(2)
            )
            : 0;

    return {
        totalTransactions,
        fraudTransactions,
        pendingCases,
        resolvedCases,
        fraudRate,
    };
};

const fraudTrends = async () => {
    const trends = await prisma.$queryRaw`
        SELECT
            DATE(t."createdAt") AS date,
            COUNT(*)::int AS "fraudCount"
        FROM "Transaction" t
        INNER JOIN "RiskAssessment" r
            ON t.id = r."transactionId"
        WHERE r.prediction = 'FRAUD'
        GROUP BY DATE(t."createdAt")
        ORDER BY date ASC;
    `;

    return trends;
};

const riskDistribution = async () => {
    const lowRisk = await prisma.riskAssessment.count({
        where: {
            riskScore: {
                lte: 30
            }
        }
    });

    const mediumRisk = await prisma.riskAssessment.count({
        where: {
            riskScore: {
                gte: 31,
                lte: 70
            }
        }
    });

    const highRisk = await prisma.riskAssessment.count({
        where: {
            riskScore: {
                gte: 71
            }
        }
    });

    return {
        lowRisk,
        mediumRisk,
        highRisk
    };
};

export {
    dashboardSummary,
    fraudTrends,
    riskDistribution,
}