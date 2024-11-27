import axios from "axios";
import { FinancialGoal } from "../types/financial-goal";
import { URL_API } from "../config/config";

export async function getFinancialGoalById(
    id: string
): Promise<FinancialGoal | null> {
    try {
        const response = await axios.get(`${URL_API}/financial-goals/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getPersonalFinancialGoals(): Promise<
    FinancialGoal[] | null
> {
    try {
        const response = await axios.get(`${URL_API}/financial-goals/personal`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getFamilyFinancialGoals(): Promise<
    FinancialGoal[] | null
> {
    try {
        const response = await axios.get(`${URL_API}/financial-goals/family`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createFinancialGoal(
    financialGoal: FinancialGoal
): Promise<FinancialGoal | null> {
    try {
        const response = await axios.post(
            `${URL_API}/financial-goals`,
            financialGoal
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteFinancialGoal(
    id: string
): Promise<FinancialGoal | null> {
    try {
        const response = await axios.delete(`${URL_API}/financial-goals/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateFinancialGoal(
    id: string,
    financialGoal: FinancialGoal
): Promise<FinancialGoal | null> {
    try {
        const response = await axios.put(
            `${URL_API}/financial-goals/${id}`,
            financialGoal
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}
