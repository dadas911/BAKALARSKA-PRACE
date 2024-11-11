import axios from "axios";
import { User } from "../types/user.ts";
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

export async function createUser(user: User): Promise<User | null> {
    try {
        const response = await axios.post(`${URL_API}/users`, user);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
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
