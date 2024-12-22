import { useState } from "react";
import { FinancialGoal } from "../../types/financial-goal";

interface FinancialGoalFormProps {
    onAddFinancialGoal: (financialGoal: FinancialGoal) => void;
    initialFinancialGoal?: FinancialGoal;
    isPersonal: boolean;
}

const FinancialGoalForm: React.FC<FinancialGoalFormProps> = ({
    onAddFinancialGoal,
    initialFinancialGoal,
    isPersonal,
}) => {
    const defaultFinancialGoal = {
        name: "",
        neededAmount: 0,
        currentAmount: 0,
        dueDate: new Date(),
        isPersonal: isPersonal,
    };

    const [financialGoal, setFinancialGoal] = useState<FinancialGoal>(
        initialFinancialGoal || defaultFinancialGoal
    );

    const handleFinancialGoalChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFinancialGoal({
            ...financialGoal,
            [e.target.name]: e.target.value,
        });
    };

    const handleFinancialGoalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddFinancialGoal(financialGoal);
    };

    return (
        <form onSubmit={handleFinancialGoalSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Jméno cíle
                </label>
                <input
                    type="text"
                    name="name"
                    value={financialGoal.name}
                    onChange={handleFinancialGoalChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    maxLength={50}
                    placeholder="Zadejte název cíle"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Potřebná částka
                </label>
                <input
                    type="number"
                    name="neededAmount"
                    value={financialGoal.neededAmount}
                    onChange={handleFinancialGoalChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="Částka, kterou chcete dosáhnout"
                    min="0"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Naspořená částka
                </label>
                <input
                    type="number"
                    name="currentAmount"
                    value={financialGoal.currentAmount}
                    onChange={handleFinancialGoalChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="Kolik jste již naspořili"
                    min="0"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Splnit do data
                </label>
                <input
                    type="date"
                    name="dueDate"
                    onChange={handleFinancialGoalChange}
                    value={
                        new Date(financialGoal.dueDate)
                            .toISOString()
                            .split("T")[0]
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                {initialFinancialGoal ? "Upravit cíl" : "Přidat cíl"}
            </button>
        </form>
    );
};

export default FinancialGoalForm;
