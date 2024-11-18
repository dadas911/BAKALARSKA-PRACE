import { Spendings } from "../../types/spendings";

interface BudgetSpendingsProps {
    spendings: Spendings[];
}

const BudgetSpendings: React.FC<BudgetSpendingsProps> = ({ spendings }) => (
    <div>
        <h3>Výdaje</h3>
        {spendings.map((spending) => (
            <p key={spending._id}>
                <b>Name:</b> {spending.name}, <b>TotalAmount:</b>{" "}
                {spending.totalAmount}, <b>SpentAmount:</b>{" "}
                {spending.spentAmount}
            </p>
        ))}
    </div>
);

export default BudgetSpendings;
