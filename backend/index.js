import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connect.js";

import userRouter from "./routes/user-routes.js";
import familyAccountRouter from "./routes/family-account-routes.js";
import personalBudgetRouter from "./routes/personal-budget-routes.js";
import familyBudgetRouter from "./routes/family-budget-routes.js";
import categoryRouter from "./routes/category-routes.js";
import transactionRouter from "./routes/transaction-routes.js";
import spendingsRouter from "./routes/spendings-routes.js";

dotenv.config();

const app = express();

//Setting up middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

//Routes setup
app.use("/api/users", userRouter);
app.use("/api/family-accounts", familyAccountRouter);
app.use("/api/personal-budget", personalBudgetRouter);
app.use("/api/family-budget", familyBudgetRouter);
app.use("/api/category", categoryRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/spendings", spendingsRouter);

const startServer = async () => {
    try {
        connectDB(process.env.URL_DB);

        app.listen(process.env.PORT, () =>
            console.log(
                "Server started on http://localhost:" + process.env.PORT
            )
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();
