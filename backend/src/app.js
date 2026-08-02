import express from "express";
import env from "./config/env.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import transactionRouter from "./modules/transaction/transaction.route.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);


app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FinGuard AI Backend Running"
    });
});

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

app.use("/api/v1/transactions", transactionRouter);

app.use("/api/dashboard", dashboardRouter);

app.use(errorHandler);

export default app;