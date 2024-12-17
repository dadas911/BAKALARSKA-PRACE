import {
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount,
} from "../controllers/family-account-controller.js";
import { FamilyAccountModel } from "../models/family-account-model.js";

jest.mock("../models/family-account-model.js");

describe("Family Account Controller", () => {
    // Test for getAccountById
    describe("getAccountById", () => {
        it("should return a family account by id when it exists", async () => {
            const mockAccount = { _id: "1", owner: "John Doe", balance: 5000 };
            FamilyAccountModel.findById.mockResolvedValue(mockAccount);

            const result = await getAccountById("1");
            expect(result).toEqual(mockAccount);
            expect(FamilyAccountModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw error if account does not exist", async () => {
            FamilyAccountModel.findById.mockResolvedValue(null);

            await expect(getAccountById("1")).rejects.toThrow(
                "Účet nebyl nalezen"
            );
        });
    });

    describe("createAccount", () => {
        it("should create a new family account", async () => {
            const newAccount = { owner: "John Doe", balance: 5000 };
            const createdAccount = { _id: "1", ...newAccount };
            FamilyAccountModel.findOne.mockResolvedValue(null);
            FamilyAccountModel.create.mockResolvedValue(createdAccount);

            const result = await createAccount(newAccount);
            expect(result).toEqual(createdAccount);
            expect(FamilyAccountModel.create).toHaveBeenCalledWith(newAccount);
        });

        it("should throw error if account with the same owner already exists", async () => {
            FamilyAccountModel.findOne.mockResolvedValue({ owner: "John Doe" });

            await expect(
                createAccount({ owner: "John Doe", balance: 5000 })
            ).rejects.toThrow("Účet s tímto vlastníkem již existuje");
        });
    });

    describe("deleteAccount", () => {
        it("should delete a family account by id", async () => {
            const mockDeletedAccount = {
                _id: "1",
                owner: "John Doe",
                balance: 5000,
            };
            FamilyAccountModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedAccount
            );

            const result = await deleteAccount("1");
            expect(result).toEqual(mockDeletedAccount);
            expect(FamilyAccountModel.findByIdAndDelete).toHaveBeenCalledWith(
                "1"
            );
        });

        it("should throw error if account does not exist", async () => {
            FamilyAccountModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteAccount("1")).rejects.toThrow(
                "Účet nebyl nalezen"
            );
        });
    });

    describe("updateAccount", () => {
        it("should update a family account by id", async () => {
            const updatedAccount = {
                _id: "1",
                owner: "John Doe",
                balance: 6000,
            };
            FamilyAccountModel.findByIdAndUpdate.mockResolvedValue(
                updatedAccount
            );

            const result = await updateAccount("1", { balance: 6000 });
            expect(result).toEqual(updatedAccount);
            expect(FamilyAccountModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { balance: 6000 },
                { new: true }
            );
        });

        it("should throw error if account does not exist", async () => {
            FamilyAccountModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(updateAccount("1", { balance: 6000 })).rejects.toThrow(
                "Účet nebyl nalezen"
            );
        });
    });
});
