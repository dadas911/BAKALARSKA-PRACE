import axios from "axios";
import { PersonalBudget } from "../types/personal-budget.ts";
import { URL_API } from "../config/config.ts";

export async function getAllPersonalBudgets(): Promise<
    PersonalBudget[] | null
> {
    try {
        const response = await axios.get(`${URL_API}/personal-budgets`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getPersonalBudgetById(
    id: string
): Promise<PersonalBudget | null> {
    try {
        const response = await axios.get(`${URL_API}/personal-budgets/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createPersonalBudget(
    budget: PersonalBudget
): Promise<PersonalBudget | null> {
    try {
        const response = await axios.post(
            `${URL_API}/personal-budgets`,
            budget
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deletePersonalBudget(
    id: string
): Promise<PersonalBudget | null> {
    try {
        const response = await axios.delete(
            `${URL_API}/personal-budgets/${id}`
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updatePersonalBudget(
    id: string,
    budget: PersonalBudget
): Promise<PersonalBudget | null> {
    try {
        const response = await axios.put(
            `${URL_API}/personal-budgets/${id}`,
            budget
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}
