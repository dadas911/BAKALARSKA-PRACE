import axios from "axios";
import { Scholarship } from "../types/scholarship";
import { URL_API } from "../config/config";

export async function getScholarshipById(
    id: string
): Promise<Scholarship | null> {
    try {
        const response = await axios.get(`${URL_API}/scholarships/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getAllScholarships(): Promise<Scholarship[] | null> {
    try {
        const response = await axios.get(`${URL_API}/scholarships`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createScholarship(
    scholarship: Scholarship
): Promise<Scholarship | null> {
    try {
        const response = await axios.post(
            `${URL_API}/scholarships`,
            scholarship
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteScholarship(
    id: string
): Promise<Scholarship | null> {
    try {
        const response = await axios.delete(`${URL_API}/scholarships/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateScholarship(
    id: string,
    scholarship: Scholarship
): Promise<Scholarship | null> {
    try {
        const response = await axios.put(
            `${URL_API}/scholarships/${id}`,
            scholarship
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}
