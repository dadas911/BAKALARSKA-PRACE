import {
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
    getAllGlobalCategories,
    getAllFamilyCategories,
} from "../controllers/category-controller.js";
import { CategoryModel } from "../models/category-model.js";

jest.mock("../models/category-model.js");

describe("Category Controller", () => {
    describe("getCategoryById", () => {
        it("should return a category by id when it exists", async () => {
            const mockCategory = { _id: "1", name: "Housing" };
            CategoryModel.findById.mockResolvedValue(mockCategory);

            const result = await getCategoryById("1");
            expect(result).toEqual(mockCategory);
            expect(CategoryModel.findById).toHaveBeenCalledWith("1");
        });

        it("should throw error if category does not exist", async () => {
            CategoryModel.findById.mockResolvedValue(null);

            await expect(getCategoryById("1")).rejects.toThrow(
                "Kategorie nebyla nalezena"
            );
        });
    });

    describe("createCategory", () => {
        it("should create a new category", async () => {
            const newCategory = { name: "Housing" };
            const createdCategory = { _id: "1", ...newCategory };
            CategoryModel.create.mockResolvedValue(createdCategory);

            const result = await createCategory(newCategory);
            expect(result).toEqual(createdCategory);
            expect(CategoryModel.create).toHaveBeenCalledWith(newCategory);
        });
    });

    describe("deleteCategory", () => {
        it("should delete a category by id", async () => {
            const mockDeletedCategory = { _id: "1", name: "Housing" };
            CategoryModel.findByIdAndDelete.mockResolvedValue(
                mockDeletedCategory
            );

            const result = await deleteCategory("1");
            expect(result).toEqual(mockDeletedCategory);
            expect(CategoryModel.findByIdAndDelete).toHaveBeenCalledWith("1");
        });

        it("should throw error if category does not exist", async () => {
            CategoryModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(deleteCategory("1")).rejects.toThrow(
                "Kategorie nebyla nalezena"
            );
        });
    });

    describe("updateCategory", () => {
        it("should update a category by id", async () => {
            const updatedCategory = { _id: "1", name: "Housing" };
            CategoryModel.findByIdAndUpdate.mockResolvedValue(updatedCategory);

            const result = await updateCategory("1", { name: "Housing" });
            expect(result).toEqual(updatedCategory);
            expect(CategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { name: "Housing" },
                { new: true }
            );
        });

        it("should throw error if category does not exist", async () => {
            CategoryModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                updateCategory("1", { name: "Housing" })
            ).rejects.toThrow("Kategorie nebyla nalezena");
        });
    });

    describe("getAllGlobalCategories", () => {
        it("should return all global categories", async () => {
            const mockCategories = [
                { _id: "1", name: "Housing", isGlobal: true },
                { _id: "2", name: "Food", isGlobal: true },
            ];
            CategoryModel.find.mockResolvedValue(mockCategories);

            const result = await getAllGlobalCategories();
            expect(result).toEqual(mockCategories);
            expect(CategoryModel.find).toHaveBeenCalledWith({ isGlobal: true });
        });
    });

    describe("getAllFamilyCategories", () => {
        it("should return all family categories for a specific account", async () => {
            const mockCategories = [
                { _id: "1", name: "Housing", familyBudget: "123" },
                { _id: "2", name: "Food", familyBudget: "123" },
            ];
            CategoryModel.find.mockResolvedValue(mockCategories);

            const result = await getAllFamilyCategories("123");
            expect(result).toEqual(mockCategories);
            expect(CategoryModel.find).toHaveBeenCalledWith({
                familyBudget: "123",
            });
        });
    });
});
