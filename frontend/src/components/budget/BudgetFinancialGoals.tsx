import { FinancialGoal } from "../../types/financial-goal";
import FinancialGoalChart from "../charts/FinancialGoalChart";

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
                    <div className="text-lg font-semibold text-neutral-700 mb-2 text-center">
                        {financialGoal.name}
                    </div>

                    <div className="flex justify-between mb-4">
                        <div className="flex flex-col space-y-2">
                            <span className={labelClass}>Potřebná částka</span>
                            <div className="text-lg font-semibold text-neutral-700">
                                {financialGoal.neededAmount} Kč
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <span className={labelClass}>Naspořená částka</span>
                            <div className="text-lg font-semibold text-green-700">
                                {financialGoal.currentAmount} Kč
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 mb-4 text-center">
                        <span className={labelClass}>Splnit do</span>
                        <div className="text-lg font-semibold text-neutral-700 ">
                            {new Date(
                                financialGoal.dueDate
                            ).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="w-full h-16 mb-4">
                        <FinancialGoalChart
                            neededAmount={financialGoal.neededAmount}
                            currentAmount={financialGoal.currentAmount}
                        />
                    </div>

                    {/* Tlačítka pro úpravy a smazání */}
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
