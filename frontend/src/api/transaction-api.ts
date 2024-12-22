import axios from "axios";
import { Transaction } from "../types/transaction";
import { URL_API } from "../config/config";

export async function getAllTransactions(): Promise<Transaction[] | null> {
    try {
        const response = await axios.get(`${URL_API}/transactions`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getTransactionById(
    id: string
): Promise<Transaction | null> {
    try {
        const response = await axios.get(`${URL_API}/transactions/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createTransaction(
    transaction: Transaction,
    month: number,
    year: number
): Promise<Transaction | null> {
    try {
        const response = await axios.post(`${URL_API}/transactions`, {
            transaction,
            month,
            year,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteTransaction(
    id: string
): Promise<Transaction | null> {
    try {
        const response = await axios.delete(`${URL_API}/transactions/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateTransaction(
    id: string,
    transaction: Transaction
): Promise<Transaction | null> {
    try {
        const response = await axios.put(
            `${URL_API}/transactions/${id}`,
            transaction
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getTransactionsByMonth(
    month: number,
    year: number
): Promise<Transaction[]> {
    try {
        const response = await axios.post(`${URL_API}/transactions/personal`, {
            month: month,
            year: year,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return [];
    }
}
