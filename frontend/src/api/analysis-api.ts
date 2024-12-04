import axios from "axios";
import { URL_API } from "../config/config";

export async function personalRiskAnalysis(
    reserve: number
): Promise<{ success: boolean; data: any; message: string }> {
    try {
        const response = await axios.post(`${URL_API}/analysis/personalrisk`, {
            reserve: reserve,
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message || "Chyba při volání API",
                data: null,
            };
        } else {
            return {
                success: false,
                message: "Chyba při volání API: " + error.message,
                data: null,
            };
        }
    }
}

export async function familyRiskAnalysis(
    reserve: number
): Promise<{ success: boolean; data: any; message: string }> {
    try {
        const response = await axios.post(`${URL_API}/analysis/familyrisk`, {
            reserve: reserve,
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message || "Chyba při volání API",
                data: null,
            };
        } else {
            return {
                success: false,
                message: "Chyba při volání API: " + error.message,
                data: null,
            };
        }
    }
}

export async function personalFinancialGoalAnalysis(
    goalId: string,
    contribution: number
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await axios.post(`${URL_API}/analysis/personalgoal`, {
            goalId: goalId,
            contribution: contribution,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return { success: false, message: "Chyba při volání API:," + error };
    }
}

export async function familyFinancialGoalAnalysis(
    goalId: string,
    contribution: number
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await axios.post(`${URL_API}/analysis/familygoal`, {
            goalId: goalId,
            contribution: contribution,
        });

        return response.data;
    } catch (error) {
        console.error("Chyba při volání API:", error);
        return { success: false, message: "Chyba při volání API:," + error };
    }
}
