import * as budgetController from "../controllers/budget-controller.js";
import { BudgetModel } from "../models/budget-model.js";
import { FamilyBudgetModel } from "../models/family-budget-model.js";
import { PersonalBudgetModel } from "../models/personal-budget-model.js";

jest.mock("../models/budget-model.js");
jest.mock("../controllers/family-account-controller.js");
jest.mock("../controllers/user-controller.js");

//Mocking findOne method for personal and family model
jest.mock("../models/family-budget-model.js", () => ({
    FamilyBudgetModel: {
        findOne: jest.fn(),
    },
}));
jest.mock("../models/personal-budget-model.js", () => ({
    PersonalBudgetModel: {
        findOne: jest.fn(),
    },
}));

describe("Budget Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getBudgetById", () => {
        it("should return a budget by id", async () => {
            const mockBudget = {
                _id: "1",
                name: "Family Budget",
                month: 12,
                year: 2024,
                income: 5000,
            };
            BudgetModel.findById.mockResolvedValue(mockBudget);

            const result = await budgetController.getBudgetById("1");

            expect(result).toEqual(mockBudget);
            expect(BudgetModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw an error if budget is not found", async () => {
            BudgetModel.findById.mockResolvedValue(null);

            await expect(budgetController.getBudgetById("1")).rejects.toThrow(
                "Rozpočet nebyl nalezen"
            );
        });
    });

    describe("getBudgetByIdAndDate", () => {
        it("should return a personal budget by id, month, and year", async () => {
            const mockPersonalBudget = {
                _id: "1",
                user: "1",
                month: 12,
                year: 2024,
                income: 1000,
            };
            PersonalBudgetModel.findOne.mockResolvedValue(mockPersonalBudget);

            const result = await budgetController.getBudgetByIdAndDate(
                "1",
                12,
                2024,
                true
            );

            expect(result).toEqual(mockPersonalBudget);
            expect(PersonalBudgetModel.findOne).toHaveBeenCalledWith({
                user: "1",
                month: 12,
                year: 2024,
            });
        });

        it("should return a family budget by id, month, and year", async () => {
            const mockFamilyBudget = {
                _id: "1",
                account: "1",
                month: 12,
                year: 2024,
                income: 5000,
            };
            FamilyBudgetModel.findOne.mockResolvedValue(mockFamilyBudget);

            const result = await budgetController.getBudgetByIdAndDate(
                "1",
                12,
                2024,
                false
            );

            expect(result).toEqual(mockFamilyBudget);
            expect(FamilyBudgetModel.findOne).toHaveBeenCalledWith({
                account: "1",
                month: 12,
                year: 2024,
            });
        });

        it("should throw an error if budget is not found", async () => {
            PersonalBudgetModel.findOne.mockResolvedValue(null);

            await expect(
                budgetController.getBudgetByIdAndDate("1", 12, 2024, true)
            ).rejects.toThrow("Rozpočet nebyl nalezen");
        });
    });

    describe("updateBudget", () => {
        it("should update a budget", async () => {
            const mockUpdatedData = {
                _id: "1",
                name: "Updated Budget",
                month: 12,
                year: 2024,
                income: 6000,
            };
            BudgetModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedData);

            const result = await budgetController.updateBudget(
                "1",
                mockUpdatedData
            );

            expect(result).toEqual(mockUpdatedData);
            expect(BudgetModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                mockUpdatedData,
                { new: true }
            );
        });

        it("should throw an error if budget is not found", async () => {
            BudgetModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                budgetController.updateBudget("1", { name: "Updated Budget" })
            ).rejects.toThrow("Rozpočet nebyl nalezen");
        });
    });
});
