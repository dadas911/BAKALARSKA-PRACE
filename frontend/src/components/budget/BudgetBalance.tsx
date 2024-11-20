import { FaBalanceScale } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { MdMoneyOff } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";

interface BudgetBalanceProps {
    name: String;
    income: number;
    expense: number;
}

const itemClass =
    "bg-white flex flex-1 items-center p-4 rounded-sm border border-gray-200";
const iconClass =
    "flex items-center rounded-full min-w-12 h-12 w-12 justify-center bg-neutral-700";
const labelClass = "text-sm text-gray-500 font-light";

const BudgetBalance: React.FC<BudgetBalanceProps> = ({
    name,
    income,
    expense,
}) => (
    <div className="w-full">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Shrnutí rozpočtu
        </h3>
        <div className="flex gap-4 w-full">
            <div className={itemClass}>
                <div className={iconClass}>
                    <MdAccountBalance className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className={labelClass}>Název účtu</span>
                    <div className="flex item-center">
                        <strong className="text-xl text-neutral-700 font-semibold">
                            {name}
                        </strong>
                    </div>
                </div>
            </div>

            <div className={itemClass}>
                <div className={iconClass}>
                    <FaBalanceScale className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className={labelClass}>Zůstatek</span>
                    <div className="flex item-center">
                        <strong
                            className={`text-xl font-semibold ${
                                income + expense === 0
                                    ? "text-neutral-700"
                                    : income + expense > 0
                                    ? "text-green-700"
                                    : "text-red-700"
                            }`}
                        >
                            {income + expense}
                        </strong>
                    </div>
                </div>
            </div>
            <div className={itemClass}>
                <div className={iconClass}>
                    <MdAttachMoney className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className={labelClass}>Příjem</span>
                    <div className="flex item-center">
                        <strong className="text-xl text-green-700 font-semibold">
                            {income}
                        </strong>
                    </div>
                </div>
            </div>
            <div className={itemClass}>
                <div className={iconClass}>
                    <MdMoneyOff className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className={labelClass}>Výdaje</span>
                    <div className="flex item-center">
                        <strong className="text-xl text-red-700 font-semibold">
                            {expense}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default BudgetBalance;
