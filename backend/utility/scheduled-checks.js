import cron from "node-cron";
import { checkScholarshipsNotifyDate } from "../controllers/scholarship-controller.js";
import { resetBudgets } from "../controllers/budget-controller.js";

cron.schedule("5 0 * * *", () => {
    console.log("Daily check - runs every day at 00:05 in the morning");
    checkScholarshipsNotifyDate();
});

cron.schedule("10 0 1 * *", () => {
    console.log(
        "Monthly check - runs every first day of month at 00:10 in the morning"
    );
    resetBudgets();
});

console.log("Cron setup DONE.");
