import { Transaction } from "../types/transaction";
import { useState, useEffect } from "react";
import { getAllTransactions } from "../api/transaction-api";

const Home = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function loadAllTransactions() {
            const data = await getAllTransactions();
            if (data) {
                setTransactions(data);
            }
        }
        loadAllTransactions();
    }, []);

    return (
        <div className="flex flex-col items-center w-full">
            <h1>Home</h1>
            <div className="w-1/3 mt-4">
                {transactions.map((transaction) => {
                    return (
                        <h5 key={transaction.name}>
                            Název: {transaction.name}, částka:{" "}
                            {transaction.amount}
                        </h5>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
