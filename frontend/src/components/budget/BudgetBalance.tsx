interface BudgetBalanceProps {
    name: String;
    income: number;
    expense: number;
}

const BudgetBalance: React.FC<BudgetBalanceProps> = ({
    name,
    income,
    expense,
}) => (
    <div>
        <h2>Shrnutí rodinného rozpočtu</h2>
        <h3>{name}</h3>
        <p>
            <b>Zůstatek:</b> {income + expense}, <b>Příjem:</b> {income},{" "}
            <b>Výdaje:</b> {expense}
        </p>
    </div>
);

export default BudgetBalance;
