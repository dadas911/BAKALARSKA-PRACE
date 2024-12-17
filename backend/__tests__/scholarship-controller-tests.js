import * as scholarshipController from "../controllers/scholarship-controller.js";
import { ScholarshipModel } from "../models/scholarship-model.js";
import * as notificationController from "../controllers/notification-controller.js";
import * as personalBudgetController from "../controllers/personal-budget-controller.js";
import * as userController from "../controllers/user-controller.js";

jest.mock("../models/scholarship-model.js");
jest.mock("../controllers/notification-controller.js");
jest.mock("../controllers/personal-budget-controller.js");
jest.mock("../controllers/user-controller.js");

describe("Scholarship Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getScholarshipById", () => {
        it("should return a scholarship by id", async () => {
            const mockScholarship = {
                _id: "1",
                name: "Scholarship 1",
                amount: 1000,
            };
            ScholarshipModel.findById.mockResolvedValue(mockScholarship);

            const result = await scholarshipController.getScholarshipById("1");

            expect(result).toEqual(mockScholarship);
            expect(ScholarshipModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw an error if scholarship is not found", async () => {
            ScholarshipModel.findById.mockResolvedValue(null);

            await expect(
                scholarshipController.getScholarshipById("1")
            ).rejects.toThrow("Stipendium nebylo nazelezno");
        });
    });

    describe("createScholarship", () => {
        it("should create a new scholarship", async () => {
            const mockScholarship = {
                _id: "1",
                name: "Scholarship 1",
                amount: 1000,
            };
            ScholarshipModel.create.mockResolvedValue(mockScholarship);

            const result = await scholarshipController.createScholarship(
                mockScholarship
            );

            expect(result).toEqual(mockScholarship);
            expect(ScholarshipModel.create).toHaveBeenCalledWith(
                mockScholarship
            );
        });
    });

    describe("deleteScholarship", () => {
        it("should delete a scholarship by id", async () => {
            const mockScholarship = {
                _id: "1",
                name: "Scholarship 1",
                amount: 1000,
            };
            ScholarshipModel.findByIdAndDelete.mockResolvedValue(
                mockScholarship
            );

            const result = await scholarshipController.deleteScholarship("1");

            expect(result).toEqual(mockScholarship);
            expect(ScholarshipModel.findByIdAndDelete).toHaveBeenCalledWith(
                "1"
            );
        });

        it("should throw an error if scholarship is not found", async () => {
            ScholarshipModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(
                scholarshipController.deleteScholarship("1")
            ).rejects.toThrow("Stipendium nebylo nazelezno");
        });
    });

    describe("updateScholarship", () => {
        it("should update a scholarship", async () => {
            const mockUpdatedData = {
                _id: "1",
                name: "Updated Scholarship",
                amount: 1500,
            };
            ScholarshipModel.findByIdAndUpdate.mockResolvedValue(
                mockUpdatedData
            );

            const result = await scholarshipController.updateScholarship(
                "1",
                mockUpdatedData
            );

            expect(result).toEqual(mockUpdatedData);
            expect(ScholarshipModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                mockUpdatedData,
                { new: true }
            );
        });

        it("should throw an error if scholarship is not found", async () => {
            const mockUpdatedData = {
                _id: "1",
                name: "Updated Scholarship",
                amount: 1500,
            };
            ScholarshipModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                scholarshipController.updateScholarship("1", mockUpdatedData)
            ).rejects.toThrow("Stipendium nebylo nazelezno");
        });
    });

    describe("checkScholarshipsNotifyDate", () => {
        it("should create a notification if today's date matches the scholarship notify date", async () => {
            const mockScholarships = [
                {
                    _id: "1",
                    name: "Scholarship 1",
                    notifyDate: new Date(),
                    personalBudget: "1",
                },
            ];
            const mockUser = { _id: "user1" };
            const mockPersonalBudget = { user: "user1" };

            ScholarshipModel.find.mockResolvedValue(mockScholarships);
            personalBudgetController.getPersonalBudgetById.mockResolvedValue(
                mockPersonalBudget
            );
            userController.getUserById.mockResolvedValue(mockUser);
            notificationController.createNotification.mockResolvedValue({});

            await scholarshipController.checkScholarshipsNotifyDate();

            expect(
                notificationController.createNotification
            ).toHaveBeenCalledWith({
                name: "Stipendium - upozornění",
                text: "Blíží se konečný termín zažádání o toto stipendium: Scholarship 1. Nezapomeňte podat svou žádost.",
                user: "user1",
            });
        });

        it("should not create a notification if the dates do not match", async () => {
            const mockScholarships = [
                {
                    _id: "1",
                    name: "Scholarship 1",
                    notifyDate: new Date("2024-12-31"),
                    personalBudget: "1",
                },
            ];
            ScholarshipModel.find.mockResolvedValue(mockScholarships);

            await scholarshipController.checkScholarshipsNotifyDate();

            expect(
                notificationController.createNotification
            ).not.toHaveBeenCalled();
        });
    });
});
