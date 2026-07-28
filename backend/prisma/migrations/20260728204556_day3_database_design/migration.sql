-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'OTP_REQUIRED', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('UPI', 'IMPS', 'NEFT', 'RTGS', 'CARD');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "FraudCaseStatus" AS ENUM ('OPEN', 'UNDER_INVESTIGATION', 'CONFIRMED_FRAUD', 'CLOSED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "Prediction" AS ENUM ('SAFE', 'SUSPICIOUS', 'FRAUD');

-- CreateEnum
CREATE TYPE "AlertSource" AS ENUM ('AI_MODEL', 'RULE_ENGINE');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "senderAccountNumber" TEXT NOT NULL,
    "receiverAccountNumber" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "transactionType" "TransactionType" NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "prediction" "Prediction" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "severity" "Severity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "generatedBy" "AlertSource" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudCase" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "FraudCaseStatus" NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FraudCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationNote" (
    "id" TEXT NOT NULL,
    "fraudCaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestigationNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_referenceNumber_key" ON "Transaction"("referenceNumber");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAssessment_transactionId_key" ON "RiskAssessment"("transactionId");

-- CreateIndex
CREATE INDEX "RiskAssessment_riskScore_idx" ON "RiskAssessment"("riskScore");

-- CreateIndex
CREATE INDEX "RiskAssessment_prediction_idx" ON "RiskAssessment"("prediction");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_assignedToId_idx" ON "Alert"("assignedToId");

-- CreateIndex
CREATE UNIQUE INDEX "FraudCase_caseNumber_key" ON "FraudCase"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FraudCase_alertId_key" ON "FraudCase"("alertId");

-- CreateIndex
CREATE INDEX "FraudCase_status_idx" ON "FraudCase"("status");

-- CreateIndex
CREATE INDEX "FraudCase_priority_idx" ON "FraudCase"("priority");

-- CreateIndex
CREATE INDEX "FraudCase_assignedToId_idx" ON "FraudCase"("assignedToId");

-- CreateIndex
CREATE INDEX "FraudCase_openedAt_idx" ON "FraudCase"("openedAt");

-- CreateIndex
CREATE INDEX "InvestigationNote_fraudCaseId_idx" ON "InvestigationNote"("fraudCaseId");

-- CreateIndex
CREATE INDEX "InvestigationNote_userId_idx" ON "InvestigationNote"("userId");

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudCase" ADD CONSTRAINT "FraudCase_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudCase" ADD CONSTRAINT "FraudCase_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationNote" ADD CONSTRAINT "InvestigationNote_fraudCaseId_fkey" FOREIGN KEY ("fraudCaseId") REFERENCES "FraudCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationNote" ADD CONSTRAINT "InvestigationNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
