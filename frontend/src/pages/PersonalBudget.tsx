import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { Transaction } from "../types/transaction";
import { getPersonalSpendingsByMonth } from "../api/spendings-api";
import { createTransaction, getTransactionsByMonth } from "../api/transaction-api";
import { PersonalBudget } from "../types/personal-budget";
import {
    getPersonalBudgetByMonth,
    getHasPersonalBudget,
} from "../api/personal-budget-api";
import { Category } from "../types/category";
import { getHasFamilyBudget } from "../api/family-budget-api";
import { getAllFamilyCategories } from "../api/category-api";

const Personal = () => {
    const [hasPersonalBudget, setHasPersonalBudget] = useState<boolean>(false);

    const [personalBudget, setPersonalBudget] = useState<PersonalBudget | null>(
        null
    );
    const [personalSpendings, setPersonalSpendings] = useState<
        Spendings[] | null
    >(null);
    const [personalTransactions, setPersonalTransactions] = useState<
        Transaction[] | null
    >(null);
    const [familyCategories, setFamilyCategories] = useState<Category[] | null>(
        null
    );

    const [newTransaction, setNewTransaction] = useState<Transaction>({
        name: "",
        amount: 0,
        date: new Date(),
        description: "",
        category: "",
    });

    const [loading, setLoading] = useState(true);

    const currDate = new Date();

    const [month, setMonth] = useState<number>(currDate.getMonth() + 1);
    const [year, setYear] = useState<number>(currDate.getFullYear());

    const getPersonalBudgetInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget();
        setHasPersonalBudget(personalBudgetStatus);

        if (personalBudgetStatus) {
            const budget = await getPersonalBudgetByMonth(month, year);
            const spendings = await getPersonalSpendingsByMonth(month, year);
            const transactions = await getTransactionsByMonth(month, year);

            setPersonalBudget(budget);
            setPersonalSpendings(spendings);
            setPersonalTransactions(transactions);

            const hasFamilyBudget = await getHasFamilyBudget();
            if (hasFamilyBudget) {
                const category = await getAllFamilyCategories();
                setFamilyCategories(category);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getPersonalBudgetInfo();
            setLoading(false);
        };

        getData();
    }, [month, year]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    function handleTransactionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    }

    async function handleTransactionSubmit(e: React.FormEvent) {
        e.preventDefault();
        let response = await createTransaction(newTransaction);
        if (response) {
            alert("Transakce byla úspěšně vytvořena");
        } else {
            alert("Chyba při vytváření transakce");
        

    if (loading) {
        return (
            <div>
                <h2>Načítání...</h2>
            </div>
        );
    }

    if (!hasPersonalBudget) {
        return (
            <div>
                <h2>Rozpočet pro tento měsíc není vytvořený</h2>
            </div>
        );
    }

    return (
        <div>
            <div>
                <label htmlFor="month">Vyberte měsíc:</label>
                <select id="month" value={month} onChange={handleMonthChange}>
                    <option value={1}>Leden</option>
                    <option value={2}>Únor</option>
                    <option value={3}>Březen</option>
                    <option value={4}>Duben</option>
                    <option value={5}>Květen</option>
                    <option value={6}>Červen</option>
                    <option value={7}>Červenec</option>
                    <option value={8}>Srpen</option>
                    <option value={9}>Září</option>
                    <option value={10}>Říjen</option>
                    <option value={11}>Listopad</option>
                    <option value={12}>Prosinec</option>
                </select>
            </div>

            <div>
                <label htmlFor="year">Vyberte rok:</label>
                <select id="year" value={year} onChange={handleYearChange}>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                </select>
            </div>

            {personalBudget ? (
                <div>
                    <h2>Shrnutí osobního rozpočtu</h2>
                    <h3>{personalBudget.name}</h3>
                    <p>
                        Zůstatek:{" "}
                        {personalBudget.income + personalBudget.expense},
                        Příjem: {personalBudget.income}, Výdaje:{" "}
                        {personalBudget.expense}
                    </p>
                </div>
            ) : (
                <p>Shrnutí osobního účtu není k dispozici.</p>
            )}

            {personalSpendings ? (
                <div>
                    <h3>Výdaje</h3>
                    {personalSpendings.map((spending) => (
                        <p key={spending._id}>
                            Name: {spending.name}, TotalAmount:{" "}
                            {spending.totalAmount}, SpentAmount:{" "}
                            {spending.spentAmount}
                        </p>
                    ))}
                </div>
            ) : (
                <p>Výdaje nejsou k dispozici.</p>
            )}

            {personalTransactions ? (
                <div>
                    <h3>Transakce</h3>
                    {personalTransactions.map((transaction) => (
                        <p key={transaction._id}>
                            Name: {transaction.name}, Amount:{" "}
                            {transaction.amount}, Description:{" "}
                            {transaction.description}
                        </p>
                    ))}
                </div>
            ) : (
                <p>Transakce nejsou k dispozici.</p>
            )}

            <form onSubmit={handleTransactionSubmit}>
                <input
                    placeholder={"Name"}
                    onChange={handleTransactionChange}
                    name="name"
                    required
                    maxLength={20}
                />
                <input
                    placeholder={"Amount"}
                    onChange={handleTransactionChange}
                    name="amount"
                    required
                    maxLength={20}
                />
                <input
                    placeholder={"Second name"}
                    onChange={handleTransactionChange}
                    name="secondName"
                    required
                    maxLength={20}
                />
                <input
                    placeholder={"E-mail"}
                    onChange={handleTransactionChange}
                    name="email"
                    required
                    maxLength={20}
                />
                Role:
                <select name="role">
                    <option value="živitel">Živitel</option>
                    <option value="člen domácnosti">Člen domácnosti</option>
                    <option value="student">Student</option>
                    <option value="senior">Senior</option>
                </select>
                <input
                    placeholder={"Password"}
                    onChange={handleChange}
                    name="password"
                    required
                    maxLength={20}
                    type="password"
                />
                <button type="submit">Vytvořit účet</button>
            </form>
        </div>
    );
};

export default Personal;
