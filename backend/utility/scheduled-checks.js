import cron from "node-cron";
import { checkScholarshipsNotifyDate } from "../controllers/scholarship-controller.js";

//Calls check scholarhip function every day at 00:05
cron.schedule("5 0 * * *", () => {
    console.log("Daily check - runs every day at 00:05 in the morning");
    checkScholarshipsNotifyDate();
});

console.log("Cron setup DONE.");
