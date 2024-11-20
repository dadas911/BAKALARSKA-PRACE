import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { Transaction } from "../types/transaction";
import { getPersonalSpendingsByMonth } from "../api/spendings-api";
import { getTransactionsByMonth } from "../api/transaction-api";
import { PersonalBudget } from "../types/personal-budget";
import {
    getPersonalBudgetByMonth,
    getHasPersonalBudget,
} from "../api/personal-budget-api";
import { Category } from "../types/category";
import { getAllFamilyCategories } from "../api/category-api";
import DatePicker from "../components/common/DatePicker";
import BudgetBalance from "../components/budget/BudgetBalance";
import BudgetSpendings from "../components/budget/Spendings";
import SpendingsForm from "../components/forms/SpendingsForm";
import Loading from "../components/common/Loading";
import Transactions from "../components/personal/Transactions";
import TransactionForm from "../components/forms/TransactionForm";
import PersonalBudgetForm from "../components/forms/PersonalBudgetForm";

const Personal = () => {
    const [refresh, setRefresh] = useState(false);

    const [hasPersonalBudget, setHasPersonalBudget] = useState<boolean>(false);

    const [personalBudget, setPersonalBudget] = useState<PersonalBudget | null>(
        null
    );
    const [personalSpendings, setPersonalSpendings] = useState<Spendings[]>([]);
    const [personalTransactions, setPersonalTransactions] = useState<
        Transaction[]
    >([]);
    const [familyCategories, setFamilyCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const currDate = new Date();

    const [month, setMonth] = useState<number>(currDate.getMonth() + 1);
    const [year, setYear] = useState<number>(currDate.getFullYear());

    const getPersonalBudgetInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget(month, year);
        setHasPersonalBudget(personalBudgetStatus);
        if (personalBudgetStatus) {
            const budget = await getPersonalBudgetByMonth(month, year);
            const spendings = await getPersonalSpendingsByMonth(month, year);
            const transactions = await getTransactionsByMonth(month, year);

            setPersonalBudget(budget);
            setPersonalSpendings(spendings);
            setPersonalTransactions(transactions);
        }

        const category = await getAllFamilyCategories();
        setFamilyCategories(category);
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getPersonalBudgetInfo();
            setLoading(false);
        };

        getData();
    }, [month, year, refresh]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    const handleAddSpendings = (newSpendings: Spendings) => {
        setPersonalSpendings((prevSpendings) => [
            ...prevSpendings,
            newSpendings,
        ]);
    };

    const handleAddTransaction = (newTransaction: Transaction) => {
        setPersonalTransactions((prevTransaction) => [
            ...prevTransaction,
            newTransaction,
        ]);
    };

    const handleCreatePersonalBudget = (newPersonalBudget: PersonalBudget) => {
        setPersonalBudget(newPersonalBudget);
    };

    const handleRefresh = () => {
        setRefresh((prev) => !prev);
    };

    if (loading) {
        return <Loading />;
    }

    if (!hasPersonalBudget) {
        return (
            <PersonalBudgetForm
                month={month}
                year={year}
                familyCategories={familyCategories}
                onCreateBudget={handleCreatePersonalBudget}
                refresh={handleRefresh}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <DatePicker
                month={month}
                year={year}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />

            {personalBudget ? (
                <>
                    <BudgetBalance
                        name={personalBudget.name}
                        income={personalBudget.income}
                        expense={personalBudget.expense}
                    />
                    {personalSpendings.length > 0 ? (
                        <BudgetSpendings spendings={personalSpendings} />
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Výdaje nejsou k dispozici.
                        </h3>
                    )}
                </>
            ) : (
                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                    Shrnutí osobního účtu není k dispozici.
                </h3>
            )}

            {/* <h4>Vytvořit nový plán výdaje</h4>
            <SpendingsForm
                familyCategories={familyCategories}
                isPersonal={true}
                onAddSpendings={handleAddSpendings}
            /> */}

            {personalTransactions.length > 0 ? (
                <Transactions
                    transactions={personalTransactions}
                    familyCategories={familyCategories}
                />
            ) : (
                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                    Transakce nejsou k dispozici.
                </h3>
            )}

            {/* <h4>Vytvořit novou transakci</h4>
            <TransactionForm
                familyCategories={familyCategories}
                onAddTransaction={handleAddTransaction}
                refresh={handleRefresh}
            /> */}
        </div>
    );
};
export default Personal;
