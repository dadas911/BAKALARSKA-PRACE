import { FinancialGoal } from "../../types/financial-goal";
import SpendingChart from "../charts/SpendingsChart";

interface BudgetFinancialGoalsProps {
    financialGoals: FinancialGoal[];
    onUpdateFinancialGoal: (financialGoal: FinancialGoal) => void;
    onDeleteFinancialGoal: (id: string) => void;
}

const containerClass =
    "w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

const itemClass =
    "bg-white p-6 rounded-sm shadow-md border border-gray-200 flex flex-col";

const labelClass = "text-sm text-gray-500 font-light";

const BudgetFinancialGoals: React.FC<BudgetFinancialGoalsProps> = ({
    financialGoals,
    onUpdateFinancialGoal,
    onDeleteFinancialGoal,
}) => (
    <div className="w-full">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Shrnutí finančních cílů
        </h3>
        <div className={containerClass}>
            {financialGoals.map((financialGoal, index) => (
                <div key={index} className={itemClass}>
                    <div>
                        <div className="text-lg font-semibold text-neutral-700 mb-2 text-center">
                            {financialGoal.name}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col space-y-2">
                                <span className={labelClass}>
                                    Potřebná částka
                                </span>
                                <div className="text-lg font-semibold text-green-700">
                                    {financialGoal.neededAmount} Kč
                                </div>
                                <span className={labelClass}>
                                    Naspořená částka
                                </span>
                                <div className="text-lg font-semibold text-red-700">
                                    {financialGoal.currentAmount} Kč
                                </div>
                            </div>

                            <div className="w-32 h-32">
                                <SpendingChart
                                    totalAmount={financialGoal.neededAmount}
                                    spentAmount={financialGoal.currentAmount}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => onUpdateFinancialGoal(financialGoal)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Upravit
                        </button>
                        <button
                            onClick={() =>
                                onDeleteFinancialGoal(
                                    financialGoal._id ||
                                        "No id for financial goal"
                                )
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Smazat
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default BudgetFinancialGoals;
