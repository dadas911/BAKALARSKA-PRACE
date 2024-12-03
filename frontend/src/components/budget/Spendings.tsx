import { Spendings } from "../../types/spendings";
import SpendingChart from "../charts/SpendingsChart";

interface BudgetSpendingsProps {
    spendings: Spendings[];
    onUpdateSpendings: (spendings: Spendings) => void;
    onDeleteSpendings: (id: string) => void;
    canModify: boolean;
}

const containerClass =
    "w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

const itemClass =
    "bg-white p-6 rounded-sm shadow-md border border-gray-200 flex flex-col";

const labelClass = "text-sm text-gray-500 font-light";

const BudgetSpendings: React.FC<BudgetSpendingsProps> = ({
    spendings,
    onUpdateSpendings,
    onDeleteSpendings,
    canModify,
}) => (
    <div className="w-full">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Shrnutí výdajů
        </h3>
        <div className={containerClass}>
            {spendings.map((spending, index) => (
                <div key={index} className={itemClass}>
                    <div>
                        <div className="text-lg font-semibold text-neutral-700 mb-2 text-center">
                            {spending.name}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col space-y-2">
                                <span className={labelClass}>
                                    Celková částka
                                </span>
                                <div className="text-lg font-semibold text-green-700">
                                    {spending.totalAmount} Kč
                                </div>
                                <span className={labelClass}>
                                    Utracená částka
                                </span>
                                <div className="text-lg font-semibold text-red-700">
                                    {spending.spentAmount} Kč
                                </div>
                            </div>

                            <div className="w-32 h-32">
                                <SpendingChart
                                    totalAmount={spending.totalAmount}
                                    spentAmount={spending.spentAmount}
                                />
                            </div>
                        </div>
                    </div>
                    {canModify && (
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => onUpdateSpendings(spending)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Upravit
                            </button>
                            <button
                                onClick={() =>
                                    onDeleteSpendings(
                                        spending._id || "No id for spending"
                                    )
                                }
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Smazat
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default BudgetSpendings;
