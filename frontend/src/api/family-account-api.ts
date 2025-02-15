import axios from "axios";
import { FamilyAccount } from "../types/family-account.ts";
import { User } from "../types/user.ts";
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

export async function getFamilyAccount(): Promise<FamilyAccount | null> {
    try {
        const response = await axios.get(`${URL_API}/family-accounts/info`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createFamilyAccount(
    account: FamilyAccount,
    roles: string[]
): Promise<FamilyAccount | null> {
    try {
        const response = await axios.post(`${URL_API}/family-accounts`, {
            account,
            roles,
        });
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

export async function addUserToAccount(
    email: String,
    roles: string[]
): Promise<boolean> {
    try {
        const response = await axios.post(`${URL_API}/family-accounts/add`, {
            email: email,
            roles: roles,
        });
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return false;
    }
}

export async function removeUserFromAccount(email: String): Promise<boolean> {
    try {
        const response = await axios.post(`${URL_API}/family-accounts/remove`, {
            email,
        });
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return false;
    }
}

export async function getAllAccountUsers(): Promise<User[]> {
    try {
        const response = await axios.get(`${URL_API}/family-accounts/users`);
        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return [];
    }
}
