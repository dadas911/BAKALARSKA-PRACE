import { useState } from "react";
import { FinancialGoal } from "../../types/financial-goal";
interface FinancialGoalAnalysisFormProps {
    isPersonal: boolean;
    goals: FinancialGoal[];
    onAnalyzeFinancialGoal: (goalId: string, contribution: number) => void;
}

const FinancialGoalAnalysisForm: React.FC<FinancialGoalAnalysisFormProps> = ({
    isPersonal,
    goals,
    onAnalyzeFinancialGoal,
}) => {
    const [selectedGoal, setSelectedGoal] = useState<string>(
        goals[0]?._id || ""
    );
    const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyzeFinancialGoal(selectedGoal, monthlyContribution);
    };

    if (goals.length === 0) {
        return (
            <p className="text-neutral-700">
                Žádný finanční cíl není k dispozici. Přidejte nový cíl, aby bylo
                možné provést analýzu.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Vyberte {isPersonal ? "osobní" : "rodinný"} cíl
                </label>
                <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                >
                    {goals.map((goal) => (
                        <option key={goal._id} value={goal._id}>
                            {goal.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Předpokládaný měsíční příspěvek (Kč)
                </label>
                <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) =>
                        setMonthlyContribution(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Aplikace počítá s tím, že s tímto příspěvkem začnete až
                    příští měsíc.
                </p>
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
                Analyzovat
            </button>
        </form>
    );
};

export default FinancialGoalAnalysisForm;
