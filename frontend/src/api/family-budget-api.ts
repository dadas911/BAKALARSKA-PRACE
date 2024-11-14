import axios from "axios";
import { FamilyBudget } from "../types/family-budget.ts";
import { URL_API } from "../config/config.ts";

export async function getAllFamilyBudgets(): Promise<FamilyBudget[] | null> {
    try {
        const response = await axios.get(`${URL_API}/family-budgets`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getFamilyBudgetById(
    id: string
): Promise<FamilyBudget | null> {
    try {
        const response = await axios.get(`${URL_API}/family-budgets/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createFamilyBudget(
    budget: FamilyBudget
): Promise<FamilyBudget | null> {
    try {
        const response = await axios.post(`${URL_API}/family-budgets`, budget);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteFamilyBudget(
    id: string
): Promise<FamilyBudget | null> {
    try {
        const response = await axios.delete(`${URL_API}/family-budgets/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateFamilyBudget(
    id: string,
    budget: FamilyBudget
): Promise<FamilyBudget | null> {
    try {
        const response = await axios.put(
            `${URL_API}/family-budgets/${id}`,
            budget
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getFamilyBudgetByMonth(
    month: number,
    year: number
): Promise<FamilyBudget | null> {
    try {
        const response = await axios.post(`${URL_API}/family-budgets/family`, {
            month: month,
            year: year,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getHasFamilyBudget(): Promise<boolean> {
    try {
        const response = await axios.get(`${URL_API}/family-budgets/check`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return false;
    }
}
