import {
    getPersonalBudgetById,
    createPersonalBudget,
    deletePersonalBudget,
    updatePersonalBudget,
} from "../controllers/personal-budget-controller.js";
import { PersonalBudgetModel } from "../models/personal-budget-model.js";

jest.mock("../models/personal-budget-model.js");

describe("Personal Budget Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getPersonalBudgetById", () => {
        it("should return a personal budget by id", async () => {
            const mockBudget = { _id: "1", expectedIncome: 1000 };
            PersonalBudgetModel.findById.mockResolvedValue(mockBudget);

            const result = await getPersonalBudgetById("1");
            expect(result).toEqual(mockBudget);
            expect(PersonalBudgetModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw an error if budget not found", async () => {
            PersonalBudgetModel.findById.mockResolvedValue(null);

            await expect(getPersonalBudgetById("1")).rejects.toThrow(
                "Osobní rozpočet nebyl nalezen"
            );
        });
    });

    describe("createPersonalBudget", () => {
        it("should create a new personal budget", async () => {
            const mockBudgetData = {
                expectedIncome: 1000,
                user: "userId",
                year: 2024,
                month: 12,
            };
            const mockCreatedBudget = { ...mockBudgetData, _id: "1" };
            PersonalBudgetModel.findOne.mockResolvedValue(null); // No existing budget
            PersonalBudgetModel.create.mockResolvedValue(mockCreatedBudget);

            const result = await createPersonalBudget(mockBudgetData);
            expect(result).toEqual(mockCreatedBudget);
            expect(PersonalBudgetModel.findOne).toHaveBeenCalledWith({
                year: mockBudgetData.year,
                month: mockBudgetData.month,
                user: mockBudgetData.user,
            });
            expect(PersonalBudgetModel.create).toHaveBeenCalledWith(
                mockBudgetData
            );
        });

        it("should throw an error if the budget already exists", async () => {
            const mockBudgetData = {
                expectedIncome: 1000,
                user: "userId",
                year: 2024,
                month: 12,
            };
            PersonalBudgetModel.findOne.mockResolvedValue(mockBudgetData); // Mock already existing budget

            await expect(createPersonalBudget(mockBudgetData)).rejects.toThrow(
                "Osobní rozpočet pro uživatele v tomto datu již existuje"
            );
        });
    });

    describe("deletePersonalBudget", () => {
        it("should delete a personal budget by id", async () => {
            const mockDeletedBudget = { _id: "1" };
            PersonalBudgetModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedBudget
            );

            const result = await deletePersonalBudget("1");
            expect(result).toEqual(mockDeletedBudget);
            expect(PersonalBudgetModel.findByIdAndDelete).toHaveBeenCalledWith(
                "1"
            );
        });

        it("should throw an error if budget not found", async () => {
            PersonalBudgetModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deletePersonalBudget("1")).rejects.toThrow(
                "Osobní rozpočet nebyl nalezen"
            );
        });
    });

    describe("updatePersonalBudget", () => {
        it("should update a personal budget by id", async () => {
            const mockUpdatedData = { expectedIncome: 2000 };
            const mockUpdatedBudget = { ...mockUpdatedData, _id: "1" };
            PersonalBudgetModel.findByIdAndUpdate.mockResolvedValue(
                mockUpdatedBudget
            );

            const result = await updatePersonalBudget("1", mockUpdatedData);
            expect(result).toEqual(mockUpdatedBudget);
            expect(PersonalBudgetModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                mockUpdatedData,
                { new: true }
            );
        });

        it("should throw an error if budget not found", async () => {
            const mockUpdatedData = { expectedIncome: 2000 };
            PersonalBudgetModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updatePersonalBudget("1", mockUpdatedData)
            ).rejects.toThrow("Osobní rozpočet nebyl nalezen");
        });
    });
});
