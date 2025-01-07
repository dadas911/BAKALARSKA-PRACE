import { useState } from "react";
import { FinancialGoal } from "../../types/financial-goal";
import FinancialGoalAnalysisForm from "../forms/FinancialGoalAnalysisForm";
import {
    familyFinancialGoalAnalysis,
    personalFinancialGoalAnalysis,
} from "../../api/analysis-api";

interface financialGoalAnalysisResult {
    financialGoalStatus: string;
    neededAmount: number;
    currentAmount: number;
    monthsToAchieveGoal: number;
    monthsToAchieveGoalRemaining: number;
    expectedMonthlyContribution: number;
    requiredMonthlyContribution: number;
    monthlyContributionAdjustment: number;
    summary: string;
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
const summaryClass = "text-lg font-semibold text-neutral-700 mb-3";
const dangerClass = "text-red-600";
const successClass = "text-green-600";

interface FinancialGoalAnalysisProps {
    personalFinancialGoals: FinancialGoal[];
    familyFinancialGoals: FinancialGoal[];
    hasFamilyAccount: boolean;
}

const FinancialGoalAnalysis: React.FC<FinancialGoalAnalysisProps> = ({
    personalFinancialGoals,
    familyFinancialGoals,
    hasFamilyAccount,
}) => {
    const [isFinancialGoalModalOpen, setIsFinancialGoalModalOpen] =
        useState(false);

    const [currFinancialGoals, setCurrFinancialGoals] = useState<
        FinancialGoal[]
    >([]);

    const [financialGoalAnalysisResult, setFinancialGoalAnalysisResult] =
        useState<financialGoalAnalysisResult | null>(null);

    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const [
        isPersonalFinancialGoalAnalysis,
        setIsPersonalFinancialGoalAnalysis,
    ] = useState<boolean>(false);

    const handleOpenFinancialGoalModal = (isPersonal: boolean) => {
        if (isPersonal) {
            setCurrFinancialGoals(personalFinancialGoals);
        } else {
            setCurrFinancialGoals(familyFinancialGoals);
        }
        setIsPersonalFinancialGoalAnalysis(isPersonal);
        setIsFinancialGoalModalOpen(true);
    };

    const handleCloseFinancialGoalModal = () =>
        setIsFinancialGoalModalOpen(false);

    const handleAnalyzeFinancialGoal = async (
        currGoalId: string,
        contribution: number
    ) => {
        setIsFinancialGoalModalOpen(false);
        if (isPersonalFinancialGoalAnalysis) {
            const response = await personalFinancialGoalAnalysis(
                currGoalId,
                contribution
            );

            if (response.success) {
                setError(false);
                const {
                    financialGoalStatus,
                    neededAmount,
                    currentAmount,
                    monthsToAchieveGoal,
                    monthsToAchieveGoalRemaining,
                    expectedMonthlyContribution,
                    requiredMonthlyContribution,
                    monthlyContributionAdjustment,
                    summary,
                    spendingReduction,
                } = response.data;
                setFinancialGoalAnalysisResult({
                    financialGoalStatus,
                    neededAmount,
                    currentAmount,
                    monthsToAchieveGoal,
                    monthsToAchieveGoalRemaining,
                    expectedMonthlyContribution,
                    requiredMonthlyContribution,
                    monthlyContributionAdjustment,
                    summary,
                    spendingReduction,
                });
            } else {
                setError(true);
                setMessage(response.message);
            }
        } else {
            const response = await familyFinancialGoalAnalysis(
                currGoalId,
                contribution
            );
            if (response.success) {
                setError(false);
                const {
                    financialGoalStatus,
                    neededAmount,
                    currentAmount,
                    monthsToAchieveGoal,
                    monthsToAchieveGoalRemaining,
                    expectedMonthlyContribution,
                    requiredMonthlyContribution,
                    monthlyContributionAdjustment,
                    summary,
                    spendingReduction,
                } = response.data;
                setFinancialGoalAnalysisResult({
                    financialGoalStatus,
                    neededAmount,
                    currentAmount,
                    monthsToAchieveGoal,
                    monthsToAchieveGoalRemaining,
                    expectedMonthlyContribution,
                    requiredMonthlyContribution,
                    monthlyContributionAdjustment,
                    summary,
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
                    Analýza finančních cílů
                </h2>
                <div className="flex flex-col gap-3">
                    <p className="text-neutral-600 leading-relaxed">
                        <strong>Analýza finančních cílů</strong> vám pomůže
                        sledovat a vyhodnotit, zda jste na správné cestě k
                        jejich úspěšnému dosažení. Stačí si vybrat již vytvořený
                        osobní či rodinný finanční cíl a zadat částku, kterou na
                        něj plánujete měsíčně přispět. Aplikace následně
                        spočítá, jestli zadaný měsíční příspěvek bude stačit na
                        jeho včasné splnění. Pokud ne, dostanete návrhy, jak
                        upravit příspěvky nebo rozpočet. Díky tomu můžete své
                        finanční cíle lépe plánovat a přizpůsobovat je své
                        finanční situaci.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-6">
                        <button
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto"
                            onClick={() => handleOpenFinancialGoalModal(true)}
                        >
                            Analýza osobních cílů
                        </button>
                        {hasFamilyAccount && (
                            <button
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto"
                                onClick={() =>
                                    handleOpenFinancialGoalModal(false)
                                }
                            >
                                Analýza rodinných cílů
                            </button>
                        )}
                    </div>
                </div>
                {financialGoalAnalysisResult && (
                    <div className="mt-8 p-4 border-t-2 border-neutral-200">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Výsledek analýzy finančního cíle
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Finančního cíle do zadaného data
                                </h4>
                                <p
                                    className={
                                        financialGoalAnalysisResult.financialGoalStatus ===
                                        "Dosáhnete"
                                            ? successClass
                                            : dangerClass
                                    }
                                >
                                    <strong>
                                        {
                                            financialGoalAnalysisResult.financialGoalStatus
                                        }
                                    </strong>
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Potřebná částka na cíl
                                </h4>
                                <p>
                                    {financialGoalAnalysisResult.neededAmount}
                                    {" Kč"}
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Naspořená částka na cíl
                                </h4>
                                <p>
                                    {financialGoalAnalysisResult.currentAmount}
                                    {" Kč"}
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Do konce finančního cílé zbývá
                                </h4>
                                <p>
                                    {
                                        financialGoalAnalysisResult.monthsToAchieveGoalRemaining
                                    }{" "}
                                    měsíců
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    S aktuálním příspěvkem se cíl splní do
                                </h4>
                                <p>
                                    {
                                        financialGoalAnalysisResult.monthsToAchieveGoal
                                    }{" "}
                                    měsíců
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Zadaný měsíční příspěvek
                                </h4>
                                <p>
                                    {
                                        financialGoalAnalysisResult.expectedMonthlyContribution
                                    }{" "}
                                    Kč
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Požadovaný měsíční příspěvek
                                </h4>
                                <p>
                                    {
                                        financialGoalAnalysisResult.requiredMonthlyContribution
                                    }{" "}
                                    Kč
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg bg-white shadow-md">
                                <h4 className="text-lg font-semibold text-neutral-700">
                                    Úprava měsíčního příspěvku
                                </h4>
                                <p>
                                    {"+" +
                                        financialGoalAnalysisResult.monthlyContributionAdjustment}{" "}
                                    Kč
                                </p>
                            </div>
                        </div>

                        <div className={`mt-6 text-center p-4 ${summaryClass}`}>
                            <p
                                className={
                                    financialGoalAnalysisResult.financialGoalStatus ===
                                    "Dosáhnete"
                                        ? successClass
                                        : dangerClass
                                }
                            >
                                {financialGoalAnalysisResult.summary}
                            </p>
                        </div>

                        {financialGoalAnalysisResult.spendingReduction.length >
                            0 && (
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
                                        {financialGoalAnalysisResult.spendingReduction.map(
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

                                {financialGoalAnalysisResult.spendingReduction.some(
                                    (item) => item.tips.length > 0
                                ) && (
                                    <div className="mt-6">
                                        <h4 className="text-lg font-semibold text-neutral-700 mb-3">
                                            Tipy pro úsporu:
                                        </h4>
                                        <div className="space-y-6">
                                            {financialGoalAnalysisResult.spendingReduction
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

            {isFinancialGoalModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 w-96">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Analýza{" "}
                            {isPersonalFinancialGoalAnalysis
                                ? "osobních"
                                : "rodinných"}{" "}
                            cílů
                        </h3>
                        <FinancialGoalAnalysisForm
                            isPersonal={isPersonalFinancialGoalAnalysis}
                            goals={currFinancialGoals}
                            onAnalyzeFinancialGoal={handleAnalyzeFinancialGoal}
                        />
                        <button
                            onClick={handleCloseFinancialGoalModal}
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

export default FinancialGoalAnalysis;
