import axios from "axios";
import { Category } from "../types/category";
import { URL_API } from "../config/config";

export async function getAllCategories(): Promise<Category[] | null> {
    try {
        const response = await axios.get(`${URL_API}/categories`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getCategoryById(id: string): Promise<Category | null> {
    try {
        const response = await axios.get(`${URL_API}/categories/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createCategory(
    category: Category
): Promise<Category | null> {
    try {
        const response = await axios.post(`${URL_API}/categories`, category);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteCategory(id: string): Promise<Category | null> {
    try {
        const response = await axios.delete(`${URL_API}/categories/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateCategory(
    id: string,
    category: Category
): Promise<Category | null> {
    try {
        const response = await axios.put(
            `${URL_API}/categories/${id}`,
            category
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getAllFamilyCategories(): Promise<Category[] | null> {
    try {
        const response = await axios.get(`${URL_API}/categories/family`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}
