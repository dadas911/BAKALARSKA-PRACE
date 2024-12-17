import {
    getUserById,
    createUser,
    deleteUser,
    updateUser,
} from "../controllers/user-controller.js";
import { UserModel } from "../models/user-model.js";

jest.mock("../models/user-model.js");

describe("User Controller", () => {
    //Test for getUserById
    describe("getUserById", () => {
        it("Should return a user by id when exists", async () => {
            const mockUser = {
                _id: "123",
                email: "test@example.com",
                name: "John Doe",
            };
            UserModel.findById.mockResolvedValue(mockUser);

            const result = await getUserById("123");
            expect(result).toEqual(mockUser);
            expect(UserModel.findById).toHaveBeenCalledWith("123");
        });

        it("should throw error when user does not exist", async () => {
            UserModel.findById.mockResolvedValue(null);

            await expect(getUserById("123")).rejects.toThrow(
                "Uživatel nebyl nalezen"
            );
        });
    });

    //Test for createUser
    describe("createUser", () => {
        it("should create a new user and return him", async () => {
            const newUser = { email: "test@example.com", username: "John Doe" };
            const createdUser = { _id: "123", ...newUser };
            UserModel.findOne.mockResolvedValue(null);
            UserModel.create.mockResolvedValue(createdUser);

            const result = await createUser(newUser);
            expect(result).toEqual(createdUser);
            expect(UserModel.findOne).toHaveBeenCalledWith({
                email: newUser.email,
            });
            expect(UserModel.create).toHaveBeenCalledWith(newUser);
        });

        it("should throw error if email is already used", async () => {
            const existingUser = { email: "test@example.com" };
            UserModel.findOne.mockResolvedValue(existingUser);

            await expect(
                createUser({ email: "test@example.com" })
            ).rejects.toThrow("Uživatel s tímto e-mailem již existuje");
        });
    });

    //Test for deleteUser
    describe("deleteUser", () => {
        it("should delete a user with given id", async () => {
            const mockDeletedUser = {
                _id: "123",
                email: "test@example.com",
                username: "John Doe",
            };
            UserModel.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

            const result = await deleteUser("123");
            expect(result).toEqual(mockDeletedUser);
            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("123");
        });

        it("should throw error if user does not exist", async () => {
            UserModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteUser("123")).rejects.toThrow(
                "Uživatel nebyl nalezen"
            );
        });
    });

    //Test pro updateUser
    describe("updateUser", () => {
        it("should update a user with given id", async () => {
            const mockUpdatedUser = {
                _id: "123",
                email: "updated@example.com",
                username: "Updated Name",
            };
            UserModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await updateUser("123", {
                email: "updated@example.com",
            });
            expect(result).toEqual(mockUpdatedUser);
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "123",
                { email: "updated@example.com" },
                { new: true }
            );
        });

        it("should throw error if user does not exist", async () => {
            UserModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updateUser("123", { email: "updated@example.com" })
            ).rejects.toThrow("Uživatel nebyl nalezen");
        });
    });
});
