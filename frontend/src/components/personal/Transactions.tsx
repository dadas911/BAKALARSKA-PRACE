import { Category } from "../../types/category";
import { Transaction } from "../../types/transaction";

interface TransactionsProps {
    transactions: Transaction[];
    familyCategories: Category[];
}

const Transactions: React.FC<TransactionsProps> = ({
    transactions,
    familyCategories,
}) => (
    <div>
        <h3>Transakce</h3>
        {transactions.map((transaction) => {
            const categoryName =
                familyCategories?.find(
                    (category) => category._id === transaction.category
                )?.name || "Neznámá kategorie";

            return (
                <p key={transaction._id}>
                    <b>Name:</b> {transaction.name}, <b>Amount:</b>{" "}
                    {transaction.amount}, <b>Description:</b>{" "}
                    {transaction.description}, <b>Kategorie:</b> {categoryName}
                </p>
            );
        })}
    </div>
);

export default Transactions;
