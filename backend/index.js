import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connect.js";
import "./utility/scheduled-checks.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger-config.js";

import userRouter from "./routes/user-routes.js";
import familyAccountRouter from "./routes/family-account-routes.js";
import personalBudgetRouter from "./routes/personal-budget-routes.js";
import familyBudgetRouter from "./routes/family-budget-routes.js";
import categoryRouter from "./routes/category-routes.js";
import transactionRouter from "./routes/transaction-routes.js";
import spendingsRouter from "./routes/spendings-routes.js";
import financialGoalRouter from "./routes/financial-goal-routers.js";
import scholarshipRouter from "./routes/scholarship-routes.js";
import notificationRouter from "./routes/notification-routes.js";
import analysisRouter from "./routes/analysis-routes.js";

dotenv.config();

const app = express();

//Setting up middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

//Setting up Swagger - api documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

//Routes setup
app.use("/api/users", userRouter);
app.use("/api/family-accounts", familyAccountRouter);
app.use("/api/personal-budgets", personalBudgetRouter);
app.use("/api/family-budgets", familyBudgetRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/spendings", spendingsRouter);
app.use("/api/financial-goals", financialGoalRouter);
app.use("/api/scholarships", scholarshipRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/analysis", analysisRouter);

const startServer = async () => {
    try {
        connectDB(process.env.URL_DB);

        app.listen(process.env.PORT, () => console.log("Server started"));
    } catch (error) {
        console.log(error);
    }
};

startServer();
