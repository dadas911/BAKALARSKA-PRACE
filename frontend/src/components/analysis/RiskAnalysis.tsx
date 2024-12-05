import { useState } from "react";
import {
    familyRiskAnalysis,
    personalRiskAnalysis,
} from "../../api/analysis-api";
import RiskAnalysisForm from "../forms/RiskAnalysisForm";

interface riskAnalysisResult {
    financialRiskLevel: string;
    reserve: number;
    averageMonthlyExpenses: number;
    recommendedReserve: number;
    increaseReserve: number;
    summary: string;
    monthCovered: number;
    spendingReduction: Array<{
        category: string;
        averageSpendings: number;
        reductionRate: number;
        adjustedSpendings: number;
        saving: number;
        tips: string[];
    }>;
}

const tableHeaderClass =
    "border-b px-4 py-2 text-left font-semibold text-neutral-700";
const tableCellClass = "border-b px-4 py-2 text-neutral-600";
const buttonClass =
    "px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto";
const summaryClass = "text-lg font-semibold text-neutral-700 mb-3";
const dangerClass = "text-red-600";
const warningClass = "text-yellow-600";
const successClass = "text-green-600";

interface RiskAnalysisProps {
    hasFamilyAccount: boolean;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ hasFamilyAccount }) => {
    const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
    const [isPersonalRiskAnalysis, setIsPersonalRiskAnalysis] =
        useState<boolean>(false);

    const [riskAnalysisResult, setRiskAnalysisResult] =
        useState<riskAnalysisResult | null>(null);

    const handleOpenRiskModal = (isPersonal: boolean) => {
        setIsPersonalRiskAnalysis(isPersonal);
        setIsRiskModalOpen(true);
    };

    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleCloseRiskModal = () => setIsRiskModalOpen(false);

    const handleAnalyzeRisk = async (currReserve: number) => {
        setIsRiskModalOpen(false);
        if (isPersonalRiskAnalysis) {
            const response = await personalRiskAnalysis(currReserve);
            if (response.success) {
                setError(false);
                const {
                    financialRiskLevel,
                    reserve,
                    averageMonthlyExpenses,
                    recommendedReserve,
                    increaseReserve,
                    summary,
                    monthCovered,
                    spendingReduction,
                } = response.data;
                setRiskAnalysisResult({
                    financialRiskLevel,
                    reserve,
                    averageMonthlyExpenses,
                    recommendedReserve,
                    increaseReserve,
                    summary,
                    monthCovered,
                    spendingReduction,
                });
            } else {
                setError(true);
                setMessage(response.message);
            }
        } else {
            const response = await familyRiskAnalysis(currReserve);
            if (response.success) {
                setError(false);
                const {
                    financialRiskLevel,
                    reserve,
                    averageMonthlyExpenses,
                    recommendedReserve,
                    increaseReserve,
                    summary,
                    monthCovered,
                    spendingReduction,
                } = response.data;
                setRiskAnalysisResult({
                    financialRiskLevel,
                    reserve,
                    averageMonthlyExpenses,
                    recommendedReserve,
                    increaseReserve,
                    summary,
                    monthCovered,
                    spendingReduction,
                });
            } else {
                setError(true);
                setMessage(response.message);
            }
        }
    };

    return (
        <>
            <div className="p-4 shadow-md sm:rounded-lg bg-white">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-4 text-center">
                    Riziková analýza
                </h2>
                <div className="flex flex-col gap-3">
                    <p className="text-neutral-600 leading-relaxed">
                        <strong>Analýza finančních rizik</strong> vám pomůže
                        zjistit, jestli máte dostatečnou finanční rezervu na
                        pokrytí průměrných měsíčních výdajů alespoň na 3 měsíce,
                        jak doporučují různí finanční odborníci. Pokus se ukáže,
                        že je Vaše finanční rezerva nedostatečná, tak Vám
                        aplikace nabídne rady, jak situaci zlepšit - třeba
                        omezením výdajů v méně důležitých kategoriích nebo
                        přesunem části příjmů do úspor. Díky tomu můžete
                        předejít nepříjemným situacím, mít finance pod lepší
                        kontrolou a být lépe finančně zajištění. Tuto analýzu si
                        můžete udělat jak pro své osobní finance, tak pro
                        rodinné finance.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-6">
                        <button
                            className={buttonClass}
                            onClick={() => handleOpenRiskModal(true)}
                        >
                            Analýza osobních rizik
                        </button>
                        {hasFamilyAccount && (
                            <button
                                className={buttonClass}
                                onClick={() => handleOpenRiskModal(false)}
                            >
                                Analýza rodinných rizik
                            </button>
                        )}
                    </div>
                </div>

                {riskAnalysisResult && (
                    <div className="mt-8 p-4 border-t-2 border-neutral-200">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Výsledek rizikové analýzy
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Úroveň finančního rizika
                                </h4>
                                <p
                                    className={
                                        riskAnalysisResult.financialRiskLevel ===
                                        "Vysoké"
                                            ? dangerClass
                                            : riskAnalysisResult.financialRiskLevel ===
                                              "Střední"
                                            ? warningClass
                                            : successClass
                                    }
                                >
                                    <strong>
                                        {riskAnalysisResult.financialRiskLevel}
                                    </strong>
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Vaše finanční rezerva
                                </h4>
                                <p>{riskAnalysisResult.reserve} Kč</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Průměrné měsíční výdaje
                                </h4>
                                <p>
                                    {riskAnalysisResult.averageMonthlyExpenses}{" "}
                                    Kč
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Doporučená rezerva
                                </h4>
                                <p>
                                    {riskAnalysisResult.recommendedReserve} Kč
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Doporučené zvýšení rezervy
                                </h4>
                                <p>{riskAnalysisResult.increaseReserve} Kč</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Pokrytí měsíců s aktuální rezervou
                                </h4>
                                <p>{riskAnalysisResult.monthCovered} měsíců</p>
                            </div>
                        </div>

                        <div className={`mt-6 text-center p-4 ${summaryClass}`}>
                            <p
                                className={
                                    riskAnalysisResult.financialRiskLevel ===
                                    "Vysoké"
                                        ? dangerClass
                                        : riskAnalysisResult.financialRiskLevel ===
                                          "Střední"
                                        ? warningClass
                                        : successClass
                                }
                            >
                                {riskAnalysisResult.summary}
                            </p>
                        </div>

                        {riskAnalysisResult.spendingReduction.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-neutral-700 mb-3">
                                    Doporučené snížení výdajů:
                                </h4>
                                <table className="w-full table-auto border-collapse border border-neutral-300">
                                    <thead>
                                        <tr>
                                            <th className={tableHeaderClass}>
                                                Kategorie
                                            </th>
                                            <th className={tableHeaderClass}>
                                                Průměrné výdaje
                                            </th>
                                            <th className={tableHeaderClass}>
                                                Doporučená úspora
                                            </th>
                                            <th className={tableHeaderClass}>
                                                Upravené výdaje
                                            </th>
                                            <th className={tableHeaderClass}>
                                                Úspora
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riskAnalysisResult.spendingReduction.map(
                                            (item, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={
                                                            tableCellClass
                                                        }
                                                    >
                                                        {item.category}
                                                    </td>
                                                    <td
                                                        className={
                                                            tableCellClass
                                                        }
                                                    >
                                                        {item.averageSpendings}{" "}
                                                        Kč
                                                    </td>
                                                    <td
                                                        className={
                                                            tableCellClass
                                                        }
                                                    >
                                                        {item.reductionRate}%
                                                    </td>
                                                    <td
                                                        className={
                                                            tableCellClass
                                                        }
                                                    >
                                                        {item.adjustedSpendings}{" "}
                                                        Kč
                                                    </td>
                                                    <td
                                                        className={
                                                            tableCellClass
                                                        }
                                                    >
                                                        {item.saving} Kč
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {/* Pokud jsou tipy, vykreslíme je jako seznam */}
                                {riskAnalysisResult.spendingReduction.some(
                                    (item) => item.tips.length > 0
                                ) && (
                                    <div className="mt-6">
                                        <h4 className="text-lg font-semibold text-neutral-700 mb-3">
                                            Tipy pro úsporu:
                                        </h4>
                                        <div className="space-y-6">
                                            {riskAnalysisResult.spendingReduction
                                                .filter(
                                                    (item) =>
                                                        item.tips.length > 0
                                                )
                                                .map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className={`tip-category ${
                                                            index % 2 === 0
                                                                ? "bg-gray-100"
                                                                : "bg-gray-200"
                                                        } p-4 rounded-lg`}
                                                    >
                                                        <h5 className="text-xl font-semibold text-neutral-800 mb-3">
                                                            {item.category}
                                                        </h5>
                                                        <ul className="list-disc pl-6">
                                                            {item.tips.map(
                                                                (
                                                                    tip,
                                                                    tipIndex
                                                                ) => (
                                                                    <li
                                                                        key={`${index}-${tipIndex}`}
                                                                        className="text-neutral-700"
                                                                    >
                                                                        {tip}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {error && (
                    <div className="mt-6">
                        <h2 className="text-lg font-medium mb-2 text-center">
                            Chyba při analýze
                        </h2>
                        <p className="text-neutral-700 leading-relaxed text-center text-red-600">
                            {message}
                        </p>
                    </div>
                )}
            </div>
            {isRiskModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="overflow-auto bg-white rounded-lg shadow-lg p-6 w-11/12 w-auto">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Analýza{" "}
                            {isPersonalRiskAnalysis ? "osobních" : "rodinných"}{" "}
                            rizik
                        </h3>
                        <RiskAnalysisForm
                            isPersonal={isPersonalRiskAnalysis}
                            onAnalyzeRisk={handleAnalyzeRisk}
                        />
                        <button
                            onClick={handleCloseRiskModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RiskAnalysis;
