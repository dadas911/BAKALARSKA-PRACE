import {
    getFamilyBudgetById,
    createFamilyBudget,
    deleteFamilyBudget,
    updateFamilyBudget,
} from "../controllers/family-budget-controller.js";
import { FamilyBudgetModel } from "../models/family-budget-model.js";

// Mocking FamilyBudgetModel methods
jest.mock("../models/family-budget-model.js");

describe("Family Budget Controller", () => {
    describe("getFamilyBudgetById", () => {
        it("should return a family budget by id", async () => {
            const mockFamilyBudget = {
                _id: "1",
                account: "account1",
                categories: [],
            };
            FamilyBudgetModel.findById.mockResolvedValue(mockFamilyBudget);

            const result = await getFamilyBudgetById("1");

            expect(result).toEqual(mockFamilyBudget);
            expect(FamilyBudgetModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw an error if the family budget is not found", async () => {
            FamilyBudgetModel.findById.mockResolvedValue(null);

            try {
                await getFamilyBudgetById("1");
            } catch (error) {
                expect(error).toHaveProperty("statusCode", 404);
                expect(error.message).toBe("Rodinný rozpočet nebyl nalezen");
            }
        });
    });

    describe("createFamilyBudget", () => {
        it("should create a new family budget", async () => {
            const newBudget = { account: "account1", month: 12, year: 2024 };
            const mockFamilyBudget = { ...newBudget, _id: "1" };
            FamilyBudgetModel.findOne.mockResolvedValue(null);
            FamilyBudgetModel.create.mockResolvedValue(mockFamilyBudget);

            const result = await createFamilyBudget(newBudget);

            expect(result).toEqual(mockFamilyBudget);
            expect(FamilyBudgetModel.create).toHaveBeenCalledWith(newBudget);
        });

        it("should throw an error if a family budget already exists for the same month/year/account", async () => {
            const newBudget = { account: "account1", month: 12, year: 2024 };
            FamilyBudgetModel.findOne.mockResolvedValue({ _id: "existing" });

            try {
                await createFamilyBudget(newBudget);
            } catch (error) {
                expect(error).toHaveProperty("statusCode", 400);
                expect(error.message).toBe(
                    "Rodinný rozpočet pro účet v tomto datu již existuje"
                );
            }
        });
    });

    describe("deleteFamilyBudget", () => {
        it("should delete a family budget by id", async () => {
            const mockFamilyBudget = {
                _id: "1",
                account: "account1",
                categories: [],
            };
            FamilyBudgetModel.findByIdAndDelete.mockResolvedValue(
                mockFamilyBudget
            );

            const result = await deleteFamilyBudget("1");

            expect(result).toEqual(mockFamilyBudget);
            expect(FamilyBudgetModel.findByIdAndDelete).toHaveBeenCalledWith(
                "1"
            );
        });

        it("should throw an error if the family budget is not found", async () => {
            FamilyBudgetModel.findByIdAndDelete.mockResolvedValue(null);

            try {
                await deleteFamilyBudget("1");
            } catch (error) {
                expect(error).toHaveProperty("statusCode", 404);
                expect(error.message).toBe("Rodinný rozpočet nebyl nalezen");
            }
        });
    });

    describe("updateFamilyBudget", () => {
        it("should update a family budget by id", async () => {
            const updatedBudget = {
                account: "account1",
                categories: ["newCategory"],
            };
            const mockUpdatedFamilyBudget = { ...updatedBudget, _id: "1" };
            FamilyBudgetModel.findByIdAndUpdate.mockResolvedValue(
                mockUpdatedFamilyBudget
            );

            const result = await updateFamilyBudget("1", updatedBudget);

            expect(result).toEqual(mockUpdatedFamilyBudget);
            expect(FamilyBudgetModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                updatedBudget,
                { new: true }
            );
        });

        it("should throw an error if the family budget is not found", async () => {
            FamilyBudgetModel.findByIdAndUpdate.mockResolvedValue(null);

            try {
                await updateFamilyBudget("1", { account: "account1" });
            } catch (error) {
                expect(error).toHaveProperty("statusCode", 404);
                expect(error.message).toBe("Rodinný rozpočet nebyl nalezen");
            }
        });
    });
});
