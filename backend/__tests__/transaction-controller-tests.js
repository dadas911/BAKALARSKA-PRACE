import {
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateTransaction,
} from "../controllers/transaction-controller.js";
import { TransactionModel } from "../models/transaction-model.js";

jest.mock("../models/transaction-model.js");

describe("Transaction Controller", () => {
    //Test for getTransactionById
    describe("getTransactionById", () => {
        it("should return a transaction when exists", async () => {
            const mockTransaction = {
                _id: "123",
                amount: 100,
                category: "Jídlo",
            };
            TransactionModel.findById.mockResolvedValue(mockTransaction);

            const result = await getTransactionById("123");
            expect(result).toEqual(mockTransaction);
            expect(TransactionModel.findById).toHaveBeenCalledWith("123");
        });

        it("should throw error if transaction does not exist", async () => {
            TransactionModel.findById.mockResolvedValue(null);

            await expect(getTransactionById("123")).rejects.toThrow(
                "Transakce nebyla nalezena"
            );
        });
    });

    //Test for createTransaction
    describe("createTransaction", () => {
        it("should create a new transaction and return it", async () => {
            const newTransaction = { amount: 100, category: "Jídlo" };
            const createdTransaction = { _id: "123", ...newTransaction };
            TransactionModel.create.mockResolvedValue(createdTransaction);

            const result = await createTransaction(newTransaction);
            expect(result).toEqual(createdTransaction);
            expect(TransactionModel.create).toHaveBeenCalledWith(
                newTransaction
            );
        });
    });

    //Test for deleteTransaction
    describe("deleteTransaction", () => {
        it("should delete a transaction with the given id", async () => {
            const mockDeletedTransaction = {
                _id: "123",
                amount: 100,
                category: "Jídlo",
            };
            TransactionModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedTransaction
            );

            const result = await deleteTransaction("123");
            expect(result).toEqual(mockDeletedTransaction);
            expect(TransactionModel.findByIdAndDelete).toHaveBeenCalledWith(
                "123"
            );
        });

        it("should throw error if transaction does not exist", async () => {
            TransactionModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteTransaction("123")).rejects.toThrow(
                "Transakce nebyla nalezena"
            );
        });
    });

    //Test for updateTransaction
    describe("updateTransaction", () => {
        it("should update a transaction with the given id", async () => {
            const mockUpdatedTransaction = {
                _id: "123",
                amount: 150,
                category: "Jídlo",
            };
            TransactionModel.findByIdAndUpdate.mockResolvedValue(
                mockUpdatedTransaction
            );

            const result = await updateTransaction("123", { amount: 150 });
            expect(result).toEqual(mockUpdatedTransaction);
            expect(TransactionModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "123",
                { amount: 150 },
                { new: true }
            );
        });

        it("should throw error if transaction does not exist", async () => {
            TransactionModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updateTransaction("123", { amount: 150 })
            ).rejects.toThrow("Transakce nebyla nalezena");
        });
    });
});
