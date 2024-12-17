import {
    getAllSpendings,
    getSpendingsById,
    createSpendings,
    deleteSpendings,
    updateSpendings,
} from "../controllers/spendings-controller.js";
import { SpendingsModel } from "../models/spendings-model.js";
import { getBudgetById } from "../controllers/budget-controller.js";
import { getCategoryById } from "../controllers/category-controller.js";
import { createNotification } from "../controllers/notification-controller.js";

jest.mock("../models/spendings-model.js");
jest.mock("../controllers/budget-controller.js");
jest.mock("../controllers/category-controller.js");
jest.mock("../controllers/family-account-controller.js");
jest.mock("../controllers/notification-controller.js");

describe("Spendings Controller", () => {
    //Test for getSpendingsById
    describe("getSpendingsById", () => {
        it("should return a spending by id", async () => {
            const mockSpending = {
                _id: "1",
                name: "Groceries",
                totalAmount: 100,
                spentAmount: 50,
            };
            SpendingsModel.findById.mockResolvedValue(mockSpending);

            const result = await getSpendingsById("1");
            expect(result).toEqual(mockSpending);
            expect(SpendingsModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw an error if spending is not found", async () => {
            SpendingsModel.findById.mockResolvedValue(null);

            await expect(getSpendingsById("1")).rejects.toThrow(
                "Výdaje nebyly nalezeny"
            );
        });
    });

    //Test for createSpendings
    describe("createSpendings", () => {
        it("should create a new spending and return it", async () => {
            const newSpending = {
                name: "Groceries",
                totalAmount: 100,
                spentAmount: 50,
                budget: "budgetId",
                category: "categoryId",
            };
            const createdSpending = { _id: "1", ...newSpending };
            SpendingsModel.create.mockResolvedValue(createdSpending);

            const result = await createSpendings(newSpending);
            expect(result).toEqual(createdSpending);
            expect(SpendingsModel.create).toHaveBeenCalledWith(newSpending);
        });
    });

    //Test for deleteSpendings
    describe("deleteSpendings", () => {
        it("should delete a spending and return it", async () => {
            const mockDeletedSpending = {
                _id: "1",
                name: "Groceries",
                totalAmount: 100,
                spentAmount: 50,
            };
            SpendingsModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedSpending
            );

            const result = await deleteSpendings("1");
            expect(result).toEqual(mockDeletedSpending);
            expect(SpendingsModel.findByIdAndDelete).toHaveBeenCalledWith("1");
        });

        it("should throw an error if spending is not found", async () => {
            SpendingsModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteSpendings("1")).rejects.toThrow(
                "Výdaje nebyly nalezeny"
            );
        });
    });

    //Test for updateSpendings
    describe("updateSpendings", () => {
        it("should update a spending, create transaction and return spending", async () => {
            const mockUpdatedSpending = {
                _id: "1",
                name: "Groceries",
                totalAmount: 100,
                spentAmount: 150,
                budget: "budgetId",
                category: "categoryId",
            };
            SpendingsModel.findByIdAndUpdate.mockResolvedValue(
                mockUpdatedSpending
            );
            getBudgetById.mockResolvedValue({
                __t: "PersonalBudget",
                user: "userId",
                account: "accountId",
            });
            getCategoryById.mockResolvedValue({ name: "Jídlo" });
            createNotification.mockResolvedValue(null);

            const result = await updateSpendings("1", { spentAmount: 150 });
            expect(result).toEqual(mockUpdatedSpending);
            expect(SpendingsModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { spentAmount: 150 },
                { new: true }
            );
            expect(createNotification).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Překročení osobního výdajového plánu",
                    user: "userId",
                })
            );
        });

        it("should throw an error if spending is not found", async () => {
            SpendingsModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updateSpendings("1", { spentAmount: 150 })
            ).rejects.toThrow("Výdaje nebyly nalezeny");
        });
    });
});
