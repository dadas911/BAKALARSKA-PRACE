import { useEffect, useState } from "react";
import { getPersonalBudgetByMonth } from "../../api/personal-budget-api";
import {
    familyBudgetAnalysis,
    personalBudgetAnalysis,
} from "../../api/analysis-api";

const buttonClass =
    "px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto";
const dangerClass = "text-red-600";
const warningClass = "text-yellow-600";
const successClass = "text-green-600";
const bubbleClass = "p-4 border rounded-lg bg-white shadow-md";
const textClass = "text-neutral-700";
const headerClass = "text-lg font-semibold text-neutral-700";
const tableHeaderClass =
    "border-b px-4 py-2 text-left font-semibold text-neutral-700";
const tableCellClass = "border-b px-4 py-2 text-neutral-600";

interface budgetAnalysisResult {
    incomeVsExpenses: {
        totalIncome: number;
        totalExpenses: number;
        balance: number;
        status: string;
        summary: string;
        recommendation: string;
    };
    exceededSpendings: {
        exceededSpendings: Array<{
            name: string;
            category: string;
            totalAmount: number;
            spentAmount: number;
            difference: number;
        }>;
        status: string;
        summary: string;
        recommendation: string;
    };
    spendingsDistribution: {
        distributionPerCategory: Array<{
            name: string;
            incomePercentage: number;
            status: string;
        }>;
        summary: string;
        recommendation: string;
    };
    tips: {
        [category: string]: string[];
    };
}

interface BudgetAnalysisProps {
    hasFamilyAccount: boolean;
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({
    hasFamilyAccount,
}) => {
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [hasPrevMonthBudget, setHasPrevMonthBudget] =
        useState<boolean>(false);

    const [budgetAnalysisResult, setBudgetAnalysisResult] =
        useState<budgetAnalysisResult | null>(null);

    const handleAnalyzeBudget = async (isPersonalBudgetAnalysis: boolean) => {
        if (isPersonalBudgetAnalysis) {
            const response = await personalBudgetAnalysis();

            if (response.success) {
                setError(false);
                const {
                    incomeVsExpenses,
                    exceededSpendings,
                    spendingsDistribution,
                    tips,
                } = response.data;

                console.log(
                    "Income vs expenses: " + JSON.stringify(incomeVsExpenses)
                );
                console.log(
                    "exceededSpendings: " + JSON.stringify(exceededSpendings)
                );
                console.log(
                    "spendingDistibution " +
                        JSON.stringify(spendingsDistribution)
                );
                console.log("Tips: " + JSON.stringify(tips));
                setBudgetAnalysisResult({
                    incomeVsExpenses,
                    exceededSpendings,
                    spendingsDistribution,
                    tips,
                });
            } else {
                setError(true);
                setMessage(response.message);
            }
        } else {
            const response = await familyBudgetAnalysis();

            if (response.success) {
                setError(false);
                const {
                    incomeVsExpenses,
                    exceededSpendings,
                    spendingsDistribution,
                    tips,
                } = response.data;
                setBudgetAnalysisResult({
                    incomeVsExpenses,
                    exceededSpendings,
                    spendingsDistribution,
                    tips,
                });
            } else {
                setError(true);
                setMessage(response.message);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            const currDate = new Date();
            const currMonth = currDate.getMonth() + 1;
            const currYear = currDate.getFullYear();
            let prevMonth = 0;
            let prevYear = 0;
            if (currMonth === 1) {
                prevMonth = 12;
                prevYear = currYear - 1;
            } else {
                prevMonth = currMonth - 1;
                prevYear = currYear;
            }

            const prevBudget = await getPersonalBudgetByMonth(
                prevMonth,
                prevYear
            );
            if (prevBudget) {
                setHasPrevMonthBudget(true);
            } else {
                setHasPrevMonthBudget(false);
            }
        };
        getData();
    }, []);

    return (
        <>
            <div className="p-4 shadow-md sm:rounded-lg bg-white">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-4 text-center">
                    Analýza osobního či rodinného rozpočtu
                </h2>
                <div className="flex flex-col gap-3">
                    <p className="text-neutral-600 leading-relaxed">
                        <strong>Analýza rozpočtu</strong> vám umožní detailně
                        zhodnotit, jak efektivně spravujete své měsíční příjmy a
                        výdaje. Pomůže vám zjistit, zda se vaše výdaje drží v
                        rámci stanoveného rozpočtu, a identifikovat oblasti, kde
                        by bylo možné ušetřit. Ať už se jedná o osobní rozpočet
                        nebo rodinné finance, analýza vám ukáže, zda je vaše
                        rozdělení financí vyvážené a v souladu s vašimi cíli.
                        Pokud ne, aplikace vám nabídne rady, jak v různých
                        kategoriích ušetřit. Tato analýza vám poskytne jasný
                        přehled o vašich finančních návycích, pomůže vám vyhnout
                        se zbytečným výdajům a usnadní dosažení lepší finanční
                        situace.
                    </p>
                    {hasPrevMonthBudget ? (
                        <div className="flex flex-col sm:flex-row justify-center gap-8 mt-6">
                            <button
                                className={buttonClass}
                                onClick={() => handleAnalyzeBudget(true)}
                            >
                                Analýza osobního rozpočtu
                            </button>
                            {hasFamilyAccount && (
                                <button
                                    className={buttonClass}
                                    onClick={() => handleAnalyzeBudget(false)}
                                >
                                    Analýza rodinného rozpočtu
                                </button>
                            )}
                        </div>
                    ) : (
                        <p className="text-red-600 mt-4 text-center">
                            K provedení analýzy rozpočtu je potřeba mít
                            vytvořený rozpočet za minulý měsíc.
                        </p>
                    )}
                </div>
                {budgetAnalysisResult && (
                    <div className="mt-8 p-4 border-t-2 border-neutral-200">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Výsledek analýzy rozpočtu
                        </h3>

                        {/* Příjmy vs Výdaje */}
                        <div className="mt-6 p-4 border rounded-lg bg-white shadow-md">
                            <h4 className="text-lg font-semibold text-neutral-700 text-center mb-4">
                                Příjmy vs Výdaje
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Stav */}
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Stav</h5>
                                    <p
                                        className={
                                            budgetAnalysisResult
                                                .incomeVsExpenses.status ===
                                            "Výdaje pod kontrolou"
                                                ? successClass
                                                : dangerClass
                                        }
                                    >
                                        {
                                            budgetAnalysisResult
                                                .incomeVsExpenses.status
                                        }
                                    </p>
                                </div>

                                {/* Celkové příjmy */}
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>
                                        Celkové příjmy
                                    </h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .incomeVsExpenses.totalIncome
                                        }{" "}
                                        Kč
                                    </p>
                                </div>

                                {/* Celkové výdaje */}
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>
                                        Celkové výdaje
                                    </h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .incomeVsExpenses.totalExpenses
                                        }{" "}
                                        Kč
                                    </p>
                                </div>

                                {/* Bilance */}
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Bilance</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .incomeVsExpenses.balance
                                        }{" "}
                                        Kč
                                    </p>
                                </div>
                            </div>

                            {/* Shrnutí a Doporučení vedle sebe */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Shrnutí</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .incomeVsExpenses.summary
                                        }
                                    </p>
                                </div>

                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Doporučení</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .incomeVsExpenses.recommendation
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Exceeded Spendings */}
                        <div className={bubbleClass}>
                            <h4 className="text-lg font-semibold text-neutral-700 text-center mb-4">
                                Exceeded Spendings
                            </h4>
                            {budgetAnalysisResult.exceededSpendings
                                .exceededSpendings.length > 0 ? (
                                <div className="space-y-6">
                                    {budgetAnalysisResult.exceededSpendings.exceededSpendings.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className={bubbleClass}
                                            >
                                                <h5 className={headerClass}>
                                                    {item.name}
                                                </h5>
                                                <p className={textClass}>
                                                    Kategorie: {item.category}
                                                </p>
                                                <p className={textClass}>
                                                    Celková částka:{" "}
                                                    {item.totalAmount} Kč
                                                </p>
                                                <p className={textClass}>
                                                    Prospentá částka:{" "}
                                                    {item.spentAmount} Kč
                                                </p>
                                                <p className={textClass}>
                                                    Rozdíl: {item.difference} Kč
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className={textClass}>
                                    Žádné překročené výdaje.
                                </p>
                            )}

                            <div className="mt-4 p-4 border rounded-lg bg-white shadow-md">
                                <h5 className={headerClass}>Stav</h5>
                                <p>
                                    {
                                        budgetAnalysisResult.exceededSpendings
                                            .status
                                    }
                                </p>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Shrnutí</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .exceededSpendings.summary
                                        }
                                    </p>
                                </div>

                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Doporučení</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .exceededSpendings
                                                .recommendation
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rozdělení výdajů - tabulka */}
                        <div className={bubbleClass}>
                            <h4 className="text-lg font-semibold text-neutral-700 text-center mb-4">
                                Rozdělení výdajů
                            </h4>
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className={tableHeaderClass}>
                                            Kategorie
                                        </th>
                                        <th className={tableHeaderClass}>
                                            Procento příjmu
                                        </th>
                                        <th className={tableHeaderClass}>
                                            Stav
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgetAnalysisResult.spendingsDistribution.distributionPerCategory.map(
                                        (item, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-neutral-100"
                                            >
                                                <td className={tableCellClass}>
                                                    {item.name}
                                                </td>
                                                <td className={tableCellClass}>
                                                    {item.incomePercentage}%
                                                </td>
                                                <td className={tableCellClass}>
                                                    {item.status}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Shrnutí</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .spendingsDistribution.summary
                                        }
                                    </p>
                                </div>

                                <div className={bubbleClass}>
                                    <h5 className={headerClass}>Doporučení</h5>
                                    <p>
                                        {
                                            budgetAnalysisResult
                                                .spendingsDistribution
                                                .recommendation
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tipy */}
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-neutral-700 text-center mb-4">
                                Tipy pro úsporu:
                            </h4>
                            <div className="space-y-6">
                                {Object.keys(budgetAnalysisResult.tips).map(
                                    (category, index) => (
                                        <div
                                            key={index}
                                            className={`tip-category ${
                                                index % 2 === 0
                                                    ? "bg-gray-100"
                                                    : "bg-gray-200"
                                            } p-4 rounded-lg`}
                                        >
                                            <h5 className="text-xl font-semibold text-neutral-800 mb-3">
                                                {category}
                                            </h5>
                                            <ul className="list-disc pl-6">
                                                {budgetAnalysisResult.tips[
                                                    category
                                                ].map((tip, tipIndex) => (
                                                    <li
                                                        key={`${index}-${tipIndex}`}
                                                        className={textClass}
                                                    >
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BudgetAnalysis;
