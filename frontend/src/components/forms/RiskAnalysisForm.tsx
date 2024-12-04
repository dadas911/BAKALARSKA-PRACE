import { useState } from "react";
import {
    familyRiskAnalysis,
    personalRiskAnalysis,
} from "../../api/analysis-api";

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

interface RiskAnalysisFormProps {
    isPersonal: boolean;
}

const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({ isPersonal }) => {
    const [enteredReserve, setEnteredReserve] = useState<number>(0);
    const [results, setResults] = useState<riskAnalysisResult | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isPersonal) {
            const response = await personalRiskAnalysis(enteredReserve);
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
                setResults({
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
            const response = await familyRiskAnalysis(enteredReserve);
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
                setResults({
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
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        {isPersonal ? "Osobní" : "Rodinná"} finanční rezerva
                        (Kč)
                    </label>
                    <input
                        type="number"
                        value={enteredReserve}
                        onChange={(e) => {
                            setEnteredReserve(Number(e.target.value));
                        }}
                        className="w-full px-3 py-2 border rounded"
                        required
                        min="0"
                        placeholder="Finanční rezerva"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    Analyzovat
                </button>
            </form>

            {results && (
                <div className="mt-6">
                    <h2 className="text-lg font-medium mb-2 text-center">
                        Výsledky analýzy
                    </h2>
                    <ul className="space-y-2">
                        <li>
                            <strong>Úroveň finančního rizika:</strong>{" "}
                            {results.financialRiskLevel}
                        </li>
                        <li>
                            <strong>Průměrné měsíční výdaje:</strong>{" "}
                            {results.averageMonthlyExpenses} Kč
                        </li>
                        <li>
                            <strong>Současná rezerva:</strong> {results.reserve}{" "}
                            Kč
                        </li>
                        <li>
                            <strong>Doporučená rezerva:</strong>{" "}
                            {results.recommendedReserve} Kč
                        </li>
                        <li>
                            <strong>Rezerva vydrží na:</strong>{" "}
                            {results.monthCovered} měsíců
                        </li>
                        <li>
                            <strong>Navýšení rezervy:</strong>{" "}
                            {results.increaseReserve} Kč
                        </li>
                        <li>
                            <strong>Shrnutí:</strong> {results.summary}
                        </li>
                    </ul>
                    {results.spendingReduction.length > 0 && (
                        <div className="mt-4">
                            <ul className="space-y-4">
                                {results.spendingReduction && (
                                    <div className="mt-4">
                                        <h3 className="text-md font-semibold mb-4 text-center">
                                            Doporučené snížení výdajů
                                        </h3>
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Kategorie
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Průměrné výdaje (Kč)
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Míra snížení (%)
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Upravené výdaje (Kč)
                                                    </th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                                        Měsíční úspora (Kč)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.spendingReduction.map(
                                                    (reduction, index) => (
                                                        <tr key={index}>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    reduction.category
                                                                }
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    reduction.averageSpendings
                                                                }{" "}
                                                                Kč
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    reduction.reductionRate
                                                                }{" "}
                                                                %
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    reduction.adjustedSpendings
                                                                }{" "}
                                                                Kč
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {
                                                                    reduction.saving
                                                                }{" "}
                                                                Kč
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="mt-6">
                    <h2 className="text-lg font-medium mb-2 text-center">
                        Chyba při analýze
                    </h2>
                    <p className="text-neutral-700 leading-relaxed">
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RiskAnalysisForm;
