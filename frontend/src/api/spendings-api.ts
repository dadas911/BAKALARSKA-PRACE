import axios from "axios";
import { Spendings } from "../types/spendings";
import { URL_API } from "../config/config";

export async function getAllSpendings(): Promise<Spendings[] | null> {
    try {
        const response = await axios.get(`${URL_API}/spendings`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getSpendingsById(id: string): Promise<Spendings | null> {
    try {
        const response = await axios.get(`${URL_API}/spendings/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createSpendings(
    spending: Spendings
): Promise<Spendings | null> {
    try {
        const response = await axios.post(`${URL_API}/spendings`, spending);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteSpendings(id: string): Promise<Spendings | null> {
    try {
        const response = await axios.delete(`${URL_API}/spendings/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateSpendings(
    id: string,
    spending: Spendings
): Promise<Spendings | null> {
    try {
        const response = await axios.put(
            `${URL_API}/spendings/${id}`,
            spending
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getPersonalSpendingsByMonth(
    month: number,
    year: number
): Promise<Spendings[] | null> {
    try {
        const response = await axios.post(`${URL_API}/spendings/personal`, {
            month: month,
            year: year,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getFamilySpendingsByMonth(
    month: number,
    year: number
): Promise<Spendings[] | null> {
    try {
        const response = await axios.post(`${URL_API}/spendings/family`, {
            month: month,
            year: year,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}
