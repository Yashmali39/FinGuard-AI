import express from "express";

import verifyToken from "../../middleware/verifyToken.js";
import authorize from "../../middleware/authorize.js";
import { dashboardSummary, riskDistribution, fraudTrends } from "./dashboard.controller.js";


const router = express.Router();

router.get(
    "/summary",
    verifyToken,
    authorize("ADMIN", "MANAGER", "ANALYST"),
    dashboardSummary
);


router.get(
    "/risk-distribution",
    verifyToken,
    authorize("ADMIN", "MANAGER", "ANALYST"),
    riskDistribution
)

router.get(
    "/fraud-trends",
    verifyToken,
    authorize("ADMIN", "MANAGER", "ANALYST"),
    fraudTrends

)


export default router;