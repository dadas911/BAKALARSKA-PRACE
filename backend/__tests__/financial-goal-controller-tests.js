import {
    getFinancialGoalById,
    getFinancialGoalByBudgetId,
    createFinancialGoal,
    deleteFinancialGoal,
    updateFinancialGoal,
} from "../controllers/financial-goal-controller.js";
import { FinancialGoalModel } from "../models/financial-goal-model.js";

jest.mock("../models/financial-goal-model.js");

describe("Financial Goal Controller", () => {
    describe("getFinancialGoalById", () => {
        it("should return a financial goal by id when it exists", async () => {
            const mockGoal = {
                _id: "1",
                goal: "Save for vacation",
                amount: 1000,
            };
            FinancialGoalModel.findById.mockResolvedValue(mockGoal);

            const result = await getFinancialGoalById("1");
            expect(result).toEqual(mockGoal);
            expect(FinancialGoalModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw error if financial goal does not exist", async () => {
            FinancialGoalModel.findById.mockResolvedValue(null);

            await expect(getFinancialGoalById("1")).rejects.toThrow(
                "Finanční cíl nebyl nalezen"
            );
        });
    });

    describe("getFinancialGoalByBudgetId", () => {
        it("should return financial goals by budget id", async () => {
            const mockGoals = [
                {
                    _id: "1",
                    goal: "Save for vacation",
                    amount: 1000,
                    budget: "budget123",
                },
                {
                    _id: "2",
                    goal: "Buy a car",
                    amount: 5000,
                    budget: "budget123",
                },
            ];
            FinancialGoalModel.find.mockResolvedValue(mockGoals);

            const result = await getFinancialGoalByBudgetId("budget123");
            expect(result).toEqual(mockGoals);
            expect(FinancialGoalModel.find).toHaveBeenCalledWith({
                budget: "budget123",
            });
        });
    });

    describe("createFinancialGoal", () => {
        it("should create a new financial goal and return it", async () => {
            const newGoal = { goal: "Save for vacation", amount: 1000 };
            const createdGoal = { _id: "1", ...newGoal };
            FinancialGoalModel.create.mockResolvedValue(createdGoal);

            const result = await createFinancialGoal(newGoal);
            expect(result).toEqual(createdGoal);
            expect(FinancialGoalModel.create).toHaveBeenCalledWith(newGoal);
        });
    });

    describe("deleteFinancialGoal", () => {
        it("should delete a financial goal by id", async () => {
            const mockDeletedGoal = {
                _id: "1",
                goal: "Save for vacation",
                amount: 1000,
            };
            FinancialGoalModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedGoal
            );

            const result = await deleteFinancialGoal("1");
            expect(result).toEqual(mockDeletedGoal);
            expect(FinancialGoalModel.findByIdAndDelete).toHaveBeenCalledWith(
                "1"
            );
        });

        it("should throw error if financial goal does not exist", async () => {
            FinancialGoalModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteFinancialGoal("1")).rejects.toThrow(
                "Finanční cíl nebyl nalezen"
            );
        });
    });

    // Test for updateFinancialGoal
    describe("updateFinancialGoal", () => {
        it("should update a financial goal by id", async () => {
            const updatedGoal = {
                _id: "1",
                goal: "Save for vacation",
                amount: 1200,
            };
            FinancialGoalModel.findByIdAndUpdate.mockResolvedValue(updatedGoal);

            const result = await updateFinancialGoal("1", { amount: 1200 });
            expect(result).toEqual(updatedGoal);
            expect(FinancialGoalModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { amount: 1200 },
                { new: true }
            );
        });

        it("should throw error if financial goal does not exist", async () => {
            FinancialGoalModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updateFinancialGoal("1", { amount: 1200 })
            ).rejects.toThrow("Finanční cíl nebyl nalezen");
        });
    });
});
