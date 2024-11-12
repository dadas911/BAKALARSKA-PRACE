import axios from "axios";
import { User } from "../types/user.ts";
import { UserLogin } from "../types/user-login.ts";
import { URL_API } from "../config/config.ts";

export async function getAllUsers(): Promise<User[] | null> {
    try {
        const response = await axios.get(`${URL_API}/users`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await axios.get(`${URL_API}/users/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createUser(
    user: User
): Promise<{ success: boolean; data: User | string }> {
    try {
        const response = await axios.post(`${URL_API}/users`, user);

        return { success: true, data: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || "Neznámá chyba při volání API";
            return { success: false, data: errorMessage };
        }
        return { success: false, data: "Neznámá chyba při volání API" };
    }
}

export async function deleteUser(id: string): Promise<User | null> {
    try {
        const response = await axios.delete(`${URL_API}/users/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateUser(id: string, user: User): Promise<User | null> {
    try {
        const response = await axios.put(`${URL_API}/users/${id}`, user);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function loginUser(user: UserLogin) {
    try {
        const response = await axios.post(`${URL_API}/users/login`, user);

        return { success: true, data: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || "Neznámá chyba při volání API";
            return { success: false, data: errorMessage };
        }
        return { success: false, data: "Neznámá chyba při volání API" };
    }
}
