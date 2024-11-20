import { Spendings } from "../../types/spendings";
import SpendingChart from "../charts/SpendingsChart";
interface BudgetSpendingsProps {
    spendings: Spendings[];
}

const containerClass =
    "w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"; // Tři sloupce na desktopech

const itemClass =
    "bg-white p-6 rounded-sm shadow-md border border-gray-200 flex flex-col"; // Flex pro sloupce

const labelClass = "text-sm text-gray-500 font-light"; // Popisky

const BudgetSpendings: React.FC<BudgetSpendingsProps> = ({ spendings }) => (
    <div className="w-full">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Shrnutí výdajů
        </h3>
        <div className={containerClass}>
            {spendings.map((spending, index) => (
                <div key={index} className={itemClass}>
                    <div className="text-lg font-semibold text-neutral-700 mb-2 text-center">
                        {spending.name}
                    </div>

                    <div className="flex justify-between items-center">
                        {/* Vlevo celkové a utracené částky */}
                        <div className="flex flex-col space-y-2">
                            <span className={labelClass}>Celková částka</span>
                            <div className="text-lg font-semibold text-green-700">
                                {spending.totalAmount} Kč
                            </div>
                            <span className={labelClass}>Utracená částka</span>
                            <div className="text-lg font-semibold text-red-700">
                                {spending.spentAmount} Kč
                            </div>
                        </div>

                        {/* Graf napravo od částek */}
                        <div className="w-32 h-32">
                            <SpendingChart
                                totalAmount={spending.totalAmount}
                                spentAmount={spending.spentAmount}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default BudgetSpendings;
