# FinGuard AI – Enterprise Fraud Detection & Investigation Platform

FinGuard AI is an enterprise-grade fraud detection and investigation platform designed for financial institutions. The platform helps organizations securely manage employees, detect suspicious transactions, investigate fraud cases, and generate analytical reports through an AI-powered workflow.

> **Current Status:** Backend Foundation & Employee Management (In Progress)

---

## Features Implemented

### Authentication & Authorization
- Employee Login
- JWT-based Authentication
- Role-Based Access Control (RBAC)
- Password Hashing using bcrypt
- Protected Routes using Authentication Middleware
- Authorization Middleware for Role Validation
- Last Login Tracking

### Employee Management
- Admin can create new employees
- Automatic Employee ID generation (EMP0001, EMP0002, ...)
- Duplicate Email Validation
- Department & Role Management
- Password Encryption before storing

### Validation & Error Handling
- Request Validation using Zod
- Global Error Handling Middleware
- Custom ApiError Class
- Async Handler Middleware

---

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT
- bcrypt

### Validation
- Zod

---

## Project Structure

```text
src/
├── config/
│   └── env.js
│
├── lib/
│   └── prisma.js
│
├── middleware/
│   ├── asyncHandler.js
│   ├── authorize.js
│   ├── errorHandler.js
│   ├── validateRequest.js
│   └── verifyToken.js
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   └── auth.validation.js
│   │
│   └── users/
│       ├── user.controller.js
│       ├── user.routes.js
│       ├── user.service.js
│       └── user.validation.js
│
├── utils/
│   └── ApiError.js
│
├── app.js
└── server.js
```

---

## Employee Roles

- ADMIN
- MANAGER
- ANALYST

---

## Departments

- FRAUD_INVESTIGATION
- RISK_MANAGEMENT
- COMPLIANCE

---

## Authentication Flow

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
Client Sends JWT
        │
        ▼
verifyToken Middleware
        │
        ▼
authorize Middleware
        │
        ▼
Protected API
```

---

## Implemented APIs

### Authentication

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | /api/auth/login | Public |

### Employees

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | /api/users | ADMIN |

---

## Environment Variables

```env
PORT=3000

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=1d

DEFAULT_ADMIN_EMAIL=
DEFAULT_ADMIN_PASSWORD=
```

---

## Installation

```bash
git clone <repository-url>

cd FinGuard-AI

npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Migrations

```bash
npx prisma migrate dev
```

Seed Default Admin

```bash
npx prisma db seed
```

Start Development Server

```bash
npm run dev
```

---

## Development Progress

### Completed

- Project Setup
- Prisma Configuration
- PostgreSQL Integration
- Authentication Module
- Authorization Middleware
- Employee Creation API
- Validation Layer
- Error Handling

### Upcoming

- Employee CRUD APIs
- Transaction Module
- Fraud Detection Module
- Investigation Module
- Alert System
- Reports & Analytics
- Dashboard APIs
- AI Fraud Detection Engine
- Case Management
- Audit Logs

---

## Author

**Yash Mali**
Computer Engineering Student

Building an Enterprise-Level AI Powered Fraud Detection Platform using Node.js, Express, PostgreSQL, Prisma, and AI.