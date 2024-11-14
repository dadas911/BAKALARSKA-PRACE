import axios from "axios";
import { FamilyAccount } from "../types/family-account.ts";
import { URL_API } from "../config/config.ts";

export async function getAllFamilyAccounts(): Promise<FamilyAccount[] | null> {
    try {
        const response = await axios.get(`${URL_API}/family-accounts`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getFamilyAccountById(
    id: string
): Promise<FamilyAccount | null> {
    try {
        const response = await axios.get(`${URL_API}/family-accounts/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createFamilyAccount(
    account: FamilyAccount
): Promise<FamilyAccount | null> {
    try {
        const response = await axios.post(
            `${URL_API}/family-accounts`,
            account
        );
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteFamilyAccount(
    id: string
): Promise<FamilyAccount | null> {
    try {
        const response = await axios.delete(`${URL_API}/family-accounts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateFamilyAccount(
    id: string,
    account: FamilyAccount
): Promise<FamilyAccount | null> {
    try {
        const response = await axios.put(
            `${URL_API}/family-accounts/${id}`,
            account
        );
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getHasFamilyAccount(): Promise<boolean> {
    try {
        const response = await axios.get(`${URL_API}/family-accounts/check`);
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return false;
    }
}
