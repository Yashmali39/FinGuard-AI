# 🛡️ FinGuard AI — Enterprise Fraud Detection & Investigation Platform

> **AI-powered financial fraud monitoring, risk analytics, and investigation platform built for modern financial institutions.**

FinGuard AI is an enterprise-grade fraud detection and investigation platform designed to monitor financial transactions, identify suspicious activity, manage fraud investigations, and provide analytical insights through a centralized workflow.

The platform combines a **secure Node.js backend, PostgreSQL-based financial data architecture, role-based access control, transaction monitoring, and fraud analytics**, with AI/ML-based fraud detection planned as the intelligence layer.

---

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-REST_API-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
![Status](https://img.shields.io/badge/Status-Backend_In_Development-orange)

---

## ✨ Key Features

### 🔐 Authentication & Access Control

- Secure employee login
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Password hashing using bcrypt
- Protected API routes
- Role-based authorization middleware
- Employee last-login tracking

**Supported Roles**

- `ADMIN`
- `MANAGER`
- `ANALYST`

---

### 👥 Employee Management

- Admin-controlled employee creation
- Automatic Employee ID generation
- Duplicate email validation
- Department assignment
- Role management
- Secure password storage

Employee IDs are automatically generated in the format:

```text
EMP0001
EMP0002
EMP0003
...
```

**Departments**

- `FRAUD_INVESTIGATION`
- `RISK_MANAGEMENT`
- `COMPLIANCE`

---

### 💳 Transaction Management

FinGuard AI provides APIs for managing and monitoring financial transactions.

- Create transactions
- View transaction details
- List transactions
- Pagination
- Filtering
- Searching
- Sorting
- Transaction type filtering
- Transaction status filtering
- Date-based filtering
- Indexed PostgreSQL queries

**Supported Transaction Types**

```text
UPI | IMPS | NEFT | RTGS | CARD
```

**Transaction Status**

```text
PENDING
OTP_REQUIRED
UNDER_REVIEW
COMPLETED
REJECTED
```

---

### 📊 Fraud Analytics Dashboard

The backend provides analytics-ready APIs for building the FinGuard monitoring dashboard.

#### Key Performance Indicators

- Total Transactions
- Fraud Transactions
- Fraud Rate
- Pending Fraud Cases
- Resolved Fraud Cases

#### Risk Distribution

Transactions are categorized using their generated risk scores:

```text
0  - 30   → LOW
31 - 70   → MEDIUM
71+       → HIGH
```

#### Fraud Trends

Fraudulent transactions are aggregated by date to provide time-series analytics for dashboard visualization.

The analytics layer uses:

- Prisma aggregations
- PostgreSQL aggregate functions
- SQL `INNER JOIN`
- Date aggregation
- Raw SQL through Prisma
- Parallel database queries using `Promise.all()`

---

## 🧠 Fraud Intelligence Architecture

```text
                    ┌──────────────────────┐
                    │     Transaction      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Risk Assessment    │
                    │                      │
                    │ Risk Score           │
                    │ Prediction           │
                    │ Confidence           │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
              SAFE        SUSPICIOUS        FRAUD
                                              │
                                              ▼
                                   ┌──────────────────┐
                                   │      Alert       │
                                   └────────┬─────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │    Fraud Case    │
                                   └────────┬─────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │  Investigation   │
                                   └────────┬─────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │    Resolution    │
                                   └──────────────────┘
```

---

## 🏗️ Backend Architecture

FinGuard AI follows a **feature-based modular architecture**.

```text
src/
│
├── config/
│   └── env.js
│
├── lib/
│   └── prisma.js
│
├── middleware/
│   ├── authorize.js
│   ├── errorHandler.js
│   ├── validateRequest.js
│   └── verifyToken.js
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   └── auth.validation.js
│   │
│   ├── users/
│   │   ├── user.controller.js
│   │   ├── user.routes.js
│   │   ├── user.service.js
│   │   └── user.validation.js
│   │
│   ├── transactions/
│   │   ├── transaction.controller.js
│   │   ├── transaction.routes.js
│   │   ├── transaction.service.js
│   │   └── transaction.validation.js
│   │
│   └── dashboard/
│       ├── dashboard.controller.js
│       ├── dashboard.routes.js
│       └── dashboard.service.js
│
├── utils/
│   ├── ApiError.js
│   └── asyncHandler.js
│
├── app.js
└── server.js
```

Each feature owns its:

```text
Routes → Controller → Service → Database
```

This keeps the backend modular and easier to scale as fraud detection, alerts, investigations, and AI services are introduced.

---

## 🗄️ Database Design

FinGuard AI uses **PostgreSQL + Prisma ORM**.

### Core Models

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Alerts      Fraud Cases
                │
                ▼
        Investigation Notes


Transaction
    │
    ├──────── Risk Assessment
    │
    └──────── Alerts
                  │
                  ▼
              Fraud Case
                  │
                  ▼
          Investigation Notes
```

### Current Database Models

| Model | Purpose |
|---|---|
| `User` | Employees and platform access |
| `Transaction` | Financial transaction records |
| `RiskAssessment` | AI/rule-based transaction risk analysis |
| `Alert` | Suspicious transaction alerts |
| `FraudCase` | Fraud investigation cases |
| `InvestigationNote` | Investigator case notes |

Frequently queried fields are indexed for efficient filtering and analytics.

---

## 🔄 Authentication Flow

```text
Employee Login
      │
      ▼
Verify Credentials
      │
      ▼
Generate JWT
      │
      ▼
Client Sends Token
      │
      ▼
verifyToken
      │
      ▼
authorize
      │
      ▼
Protected API
```

---

## 🚀 API Overview

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Employee login |

### Employee Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users` | ADMIN | Create employee |

### Transaction Management

Transaction APIs currently support:

- Creation
- Listing
- Individual transaction retrieval
- Pagination
- Search
- Filtering
- Sorting

All transaction APIs are protected through authentication and RBAC.

### Dashboard Analytics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard/summary` | ADMIN / MANAGER / ANALYST | Dashboard KPIs |
| `GET` | `/dashboard/risk-distribution` | ADMIN / MANAGER / ANALYST | Risk distribution |
| `GET` | `/dashboard/fraud-trends` | ADMIN / MANAGER / ANALYST | Fraud trend analytics |

---

## 📈 Dashboard API Example

### Dashboard Summary

```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "totalTransactions": 1000,
    "fraudTransactions": 35,
    "fraudRate": 3.5,
    "pendingCases": 12,
    "resolvedCases": 23
  }
}
```

### Risk Distribution

```json
{
  "lowRisk": 650,
  "mediumRisk": 280,
  "highRisk": 70
}
```

### Fraud Trends

```json
[
  {
    "date": "2026-08-01",
    "fraudCount": 8
  },
  {
    "date": "2026-08-02",
    "fraudCount": 12
  }
]
```

---

## ⚡ Backend Optimizations

The backend currently includes:

- PostgreSQL indexing
- Pagination
- Query-level filtering
- Database-side aggregation
- Parallel independent queries using `Promise.all()`
- Prisma connection management
- Centralized validation
- Centralized error handling
- Feature-based modular architecture

Dashboard aggregation is performed primarily at the database layer rather than loading large datasets into the application.

---

## 🛠️ Tech Stack

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

### Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

### Authentication & Validation

![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1)

### Planned Frontend

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

### Planned AI/ML

```text
Python
XGBoost / LightGBM
IEEE-CIS Fraud Detection Dataset
SHAP Explainability
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=1d

DEFAULT_ADMIN_EMAIL=
DEFAULT_ADMIN_PASSWORD=
```

> Never commit your `.env` file or production credentials.

---

## 💻 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd FinGuard-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Seed Default Admin

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

---

## 🚧 Current Project Status

### Implemented

- ✅ Backend project architecture
- ✅ PostgreSQL + Prisma integration
- ✅ Authentication
- ✅ JWT security
- ✅ Role-Based Access Control
- ✅ Employee management
- ✅ Request validation
- ✅ Centralized error handling
- ✅ Transaction management
- ✅ Pagination, filtering, searching & sorting
- ✅ Fraud data models
- ✅ Risk assessment architecture
- ✅ Alert architecture
- ✅ Investigation data model
- ✅ Dashboard KPIs
- ✅ Risk distribution analytics
- ✅ Fraud trend analytics

### In Development / Planned

- ⏳ Fraud detection workflow
- ⏳ Alert management APIs
- ⏳ Fraud investigation APIs
- ⏳ Case management
- ⏳ AI/ML fraud detection engine
- ⏳ SHAP explainability
- ⏳ Redis caching
- ⏳ React frontend
- ⏳ Recharts analytics dashboard
- ⏳ Deployment

---

## 🎯 Project Goal

FinGuard AI aims to demonstrate how a modern financial fraud platform can combine:

**Backend Engineering + Financial Data Modeling + Security + Analytics + Machine Learning + Explainable AI**

into a unified fraud detection and investigation workflow.

---

## 👨‍💻 Author

**Yash Mali**

Computer Engineering Student

Building an enterprise-level AI-powered fraud detection and investigation platform using **Node.js, Express, PostgreSQL, Prisma, React, and Machine Learning**.

---

> 🛡️ **FinGuard AI** — Detect. Investigate. Understand.