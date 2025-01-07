import { useState } from "react";
import { Category } from "../../types/category";
import { Transaction } from "../../types/transaction";

interface TransactionFormProps {
    familyCategories: Category[];
    onAddTransaction: (transaction: Transaction) => void;
    initialTransaction?: Transaction;
    month: number;
    year: number;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
    familyCategories,
    onAddTransaction,
    initialTransaction,
    month,
    year,
}) => {
    const defaultTransaction = {
        name: "",
        amount: 0,
        date: new Date(year, month - 1, 2),
        description: "",
        category: "DEFAULT",
    };

    const [transaction, setTransaction] = useState<Transaction>(
        initialTransaction || defaultTransaction
    );

    const handleTransactionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setTransaction({
            ...transaction,
            [e.target.name]: e.target.value,
        });
    };

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddTransaction(transaction);
    };

    return (
        <form onSubmit={handleTransactionSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Název</label>
                <input
                    type="text"
                    name="name"
                    value={transaction.name}
                    onChange={handleTransactionChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    maxLength={50}
                    placeholder="Název"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Částka</label>
                <input
                    type="number"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleTransactionChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    maxLength={10}
                    placeholder="Částka"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Datum</label>
                <input
                    type="date"
                    name="date"
                    onChange={handleTransactionChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    value={
                        new Date(transaction.date).toISOString().split("T")[0]
                    }
                    max={new Date(year, month, 0).toISOString().split("T")[0]}
                    min={year + "-" + String(month).padStart(2, "0") + "-01"}
                    placeholder="Datum"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Popis</label>
                <input
                    type="text"
                    name="description"
                    value={transaction.description}
                    onChange={handleTransactionChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    maxLength={150}
                    placeholder="Popis"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Kategorie
                </label>
                {familyCategories.length > 0 ? (
                    <select
                        name="category"
                        onChange={handleTransactionChange}
                        className="w-full px-3 py-2 border rounded"
                        defaultValue={transaction.category}
                    >
                        <option hidden disabled value="DEFAULT">
                            Vyberte kategorii
                        </option>
                        {familyCategories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>Žádné kategorie k dispozici.</p>
                )}
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {initialTransaction ? "Upravit transakci" : "Přidat transakci"}
            </button>
        </form>
    );
};

export default TransactionForm;
