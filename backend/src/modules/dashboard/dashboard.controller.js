import * as dashboardService from "./dashboard.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const dashboardSummary = asyncHandler(async (req, res) => {
    const summary = await dashboardService.dashboardSummary();

    res.status(200).json({
        success: true,
        message: "Dashboard summary fetched successfully",
        data: summary,
    });
});

const riskDistribution = asyncHandler(async (req, res) => {
    const distribution = await dashboardService.riskDistribution();

    res.status(200).json({
        success: true,
        message: "Risk distribution fetched successfully",
        data: distribution,
    });
});

const fraudTrends = asyncHandler(async (req, res) => {
    const trends = await dashboardService.fraudTrends();

    res.status(200).json({
        success: true,
        message: "Fraud trends fetched successfully",
        data: trends,
    });
});

export {
    dashboardSummary,
    riskDistribution,
    fraudTrends,
};