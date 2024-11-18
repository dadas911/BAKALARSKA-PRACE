import { useState } from "react";
import { Category } from "../../types/category";
import { createTransaction } from "../../api/transaction-api";
import { Transaction } from "../../types/transaction";

interface TransactionFormProps {
    familyCategories: Category[];
    onAddTransaction: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
    familyCategories,
    onAddTransaction,
}) => {
    const defaultTransaction = {
        name: "",
        amount: 0,
        date: new Date(),
        description: "",
        category: "",
    };

    const currDate = new Date();

    const [newTransaction, setNewTransaction] =
        useState<Transaction>(defaultTransaction);

    const handleTransactionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewTransaction({
            ...newTransaction,
            [e.target.name]: e.target.value,
        });
    };

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let response = await createTransaction(newTransaction);
        if (response) {
            onAddTransaction(response);
            setNewTransaction(defaultTransaction);
        } else {
            alert("Chyba při vytváření transakce");
        }
    };

    return (
        <form onSubmit={handleTransactionSubmit}>
            <input
                placeholder={"Name"}
                onChange={handleTransactionChange}
                name="name"
                required
                value={newTransaction.name}
                maxLength={50}
            />
            <input
                placeholder={"Amount"}
                onChange={handleTransactionChange}
                name="amount"
                required
                type="number"
                value={newTransaction.amount}
                maxLength={10}
            />
            <input
                placeholder={"Date"}
                onChange={handleTransactionChange}
                name="date"
                required
                type="date"
                min={
                    currDate.getFullYear() +
                    "-" +
                    String(currDate.getMonth() + 1).padStart(2, "0") +
                    "-01"
                }
                max={
                    currDate.getFullYear() +
                    "-" +
                    String(currDate.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(currDate.getDate()).padStart(2, "0")
                }
                maxLength={20}
            />
            <input
                placeholder={"Description"}
                onChange={handleTransactionChange}
                name="description"
                required
                type="text"
                value={newTransaction.description}
                maxLength={150}
            />
            Kategorie:
            {familyCategories.length > 0 ? (
                <select
                    name="category"
                    defaultValue="DEFAULT"
                    onChange={handleTransactionChange}
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
            <button type="submit">Přidat transakci</button>
        </form>
    );
};

export default TransactionForm;
