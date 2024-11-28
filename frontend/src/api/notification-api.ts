import axios from "axios";
import { Notification } from "../types/notification";
import { URL_API } from "../config/config";

export async function getAllUserNotifications(): Promise<
    Notification[] | null
> {
    try {
        const response = await axios.get(`${URL_API}/notifications`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function getNotificationById(
    id: string
): Promise<Notification | null> {
    try {
        const response = await axios.get(`${URL_API}/notifications/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function createNotifications(
    notification: Notification
): Promise<Notification | null> {
    try {
        const response = await axios.post(
            `${URL_API}/notifications`,
            notification
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function deleteNotifications(
    id: string
): Promise<Notification | null> {
    try {
        const response = await axios.delete(`${URL_API}/notifications/${id}`);

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}

export async function updateNotifications(
    id: string,
    notification: Notification
): Promise<Notification | null> {
    try {
        const response = await axios.put(
            `${URL_API}/notifications/${id}`,
            notification
        );

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return null;
    }
}
