import { Category } from "../../types/category";
import { Transaction } from "../../types/transaction";

interface TransactionsProps {
    transactions: Transaction[];
    familyCategories: Category[];
    onUpdateTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({
    transactions,
    familyCategories,
    onUpdateTransaction,
    onDeleteTransaction,
}) => (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Transakce
        </h3>
        <table className="w-full text-sm text-left text-gray-500 bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Název
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Částka
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Popis
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Kategorie
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Akce
                    </th>
                </tr>
            </thead>
            <tbody>
                {transactions.length > 0 ? (
                    transactions.map((transaction) => {
                        const categoryName =
                            familyCategories?.find(
                                (category) =>
                                    category._id === transaction.category
                            )?.name || "Neznámá kategorie";

                        return (
                            <tr
                                key={transaction._id}
                                className="bg-white border-b hover:bg-green-100"
                            >
                                <td className="px-6 py-4 font-semibold">
                                    {transaction.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={
                                            transaction.amount > 0
                                                ? "text-green-700"
                                                : "text-red-700"
                                        }
                                    >
                                        {transaction.amount}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {transaction.description}
                                </td>
                                <td className="px-6 py-4">{categoryName}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={() =>
                                            onUpdateTransaction(transaction)
                                        }
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Upravit
                                    </button>
                                    <button
                                        onClick={() =>
                                            onDeleteTransaction(
                                                transaction._id ||
                                                    "No id for category"
                                            )
                                        }
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Smazat
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td
                            colSpan={4}
                            className="px-6 py-4 text-center text-red-700"
                        >
                            Žádné transakce k dispozici.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default Transactions;
