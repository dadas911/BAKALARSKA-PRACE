import {
    getAllUsersNotifications,
    getNotificationById,
    createNotification,
    deleteNotification,
    updateNotification,
} from "../controllers/notification-controller.js";
import { NotificationModel } from "../models/notification-model.js";

jest.mock("../models/notification-model.js");

describe("Notification Controller", () => {
    describe("getNotificationById", () => {
        it("should return a notification by id when it exists", async () => {
            const mockNotification = {
                _id: "1",
                name: "Test Notification",
                user: "123",
            };
            NotificationModel.findById.mockResolvedValue(mockNotification);

            const result = await getNotificationById("1");

            expect(result).toEqual(mockNotification);
            expect(NotificationModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw error if notification does not exist", async () => {
            NotificationModel.findById.mockResolvedValue(null);

            await expect(getNotificationById("1")).rejects.toThrow(
                "Notifikace nebyla nalezena"
            );
        });
    });

    describe("createNotification", () => {
        it("should create a new notification", async () => {
            const notification = {
                name: "Test Notification",
                text: "This is a test",
                user: "123",
            };
            const mockCreatedNotification = { _id: "1", ...notification };
            NotificationModel.create.mockResolvedValue(mockCreatedNotification);

            const result = await createNotification(notification);

            expect(result).toEqual(mockCreatedNotification);
            expect(NotificationModel.create).toHaveBeenCalledWith(notification);
        });
    });

    describe("deleteNotification", () => {
        it("should delete a notification by id", async () => {
            const mockDeletedNotification = {
                _id: "1",
                name: "Test Notification",
                user: "123",
            };
            NotificationModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedNotification
            );

            const result = await deleteNotification("1");

            expect(result).toEqual(mockDeletedNotification);
            expect(NotificationModel.findByIdAndDelete).toHaveBeenCalledWith(
                "1"
            );
        });

        it("should throw error if notification does not exist", async () => {
            NotificationModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteNotification("1")).rejects.toThrow(
                "Notifikace nebyla nalezena"
            );
        });
    });

    // Test for updateNotification
    describe("updateNotification", () => {
        it("should update a notification by id", async () => {
            const updatedData = {
                name: "Updated Notification",
                text: "Updated text",
            };
            const mockUpdatedNotification = { _id: "1", ...updatedData };
            NotificationModel.findByIdAndUpdate.mockResolvedValue(
                mockUpdatedNotification
            );

            const result = await updateNotification("1", updatedData);

            expect(result).toEqual(mockUpdatedNotification);
            expect(NotificationModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                updatedData,
                { new: true }
            );
        });

        it("should throw error if notification does not exist", async () => {
            NotificationModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updateNotification("1", { name: "Updated Notification" })
            ).rejects.toThrow("Notifikace nebyla nalezena");
        });
    });
});
