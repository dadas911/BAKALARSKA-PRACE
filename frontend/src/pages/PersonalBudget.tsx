import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { Transaction } from "../types/transaction";
import {
    createSpendings,
    deleteSpendings,
    getPersonalSpendingsByMonth,
    updateSpendings,
} from "../api/spendings-api";
import {
    createTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    updateTransaction,
} from "../api/transaction-api";
import { PersonalBudget } from "../types/personal-budget";
import {
    getPersonalBudgetByMonth,
    getHasPersonalBudget,
    updatePersonalBudget,
    createPersonalBudget,
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

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [updatingTransaction, setUpdatingTransaction] =
        useState<Transaction | null>(null);

    const [isSpendingsModalOpen, setIsSpendingsModalOpen] = useState(false);
    const [updatingSpendings, setUpdatingSpendings] =
        useState<Spendings | null>(null);

    const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

    const handleOpenEditBudget = () => {
        setIsEditBudgetOpen(true);
    };

    const handleCloseEditBudget = () => {
        setIsEditBudgetOpen(false);
    };

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

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    const handleOpenSpendingsModal = (spendings?: Spendings) => {
        setUpdatingSpendings(spendings || null);
        setIsSpendingsModalOpen(true);
    };

    const handleCloseSpendingsModal = () => {
        setUpdatingSpendings(null);
        setIsSpendingsModalOpen(false);
    };

    const handleAddSpendings = async (newSpendings: Spendings) => {
        if (updatingSpendings) {
            await updateSpendings(newSpendings._id || "No id", newSpendings);
            setPersonalSpendings((prevSpendings) =>
                prevSpendings.map((spendings) =>
                    spendings._id === updatingSpendings._id
                        ? newSpendings
                        : spendings
                )
            );
        } else {
            const rensponseSpendings = await createSpendings(newSpendings);
            if (rensponseSpendings) {
                setPersonalSpendings((prevSpendings) => [
                    ...prevSpendings,
                    rensponseSpendings,
                ]);
            }
        }

        handleCloseSpendingsModal();
    };

    const handleDeleteSpendings = async (id: string) => {
        try {
            await deleteSpendings(id);
            setPersonalSpendings((prevSpendings) =>
                prevSpendings.filter((spendings) => spendings._id !== id)
            );
        } catch (error) {
            console.error("Error deleting spendings:" + error);
        }
    };

    const handleOpenTransactionModal = (transaction?: Transaction) => {
        setUpdatingTransaction(transaction || null);
        setIsTransactionModalOpen(true);
    };

    const handleCloseTransactionModal = () => {
        setUpdatingTransaction(null);
        setIsTransactionModalOpen(false);
    };

    const handleAddTransaction = async (newTransaction: Transaction) => {
        if (updatingTransaction) {
            updateTransaction(newTransaction._id || "No id", newTransaction);
            setPersonalTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction._id === updatingTransaction._id
                        ? newTransaction
                        : transaction
                )
            );
        } else {
            const rensponseTransaction = await createTransaction(
                newTransaction
            );
            if (rensponseTransaction) {
                setPersonalTransactions((prevTransaction) => [
                    ...prevTransaction,
                    rensponseTransaction,
                ]);
            }
        }

        handleCloseTransactionModal();
    };

    const handleDeleteTransaction = async (id: string) => {
        try {
            await deleteTransaction(id);
            setPersonalTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction._id !== id)
            );
        } catch (error) {
            console.log("Error deleting transaction: " + error);
        }
    };

    const handleCreatePersonalBudget = async (
        newPersonalBudget: PersonalBudget
    ) => {
        try {
            const response = await createPersonalBudget(newPersonalBudget);
            if (response) {
                console.log("personalBudget response");
                setPersonalBudget(response);
                handleRefresh();
            }
        } catch (error) {
            console.log("Error creating personal budget: " + error);
        }
    };

    const handleUpdatePersonalBudget = async (
        updatedBudget: PersonalBudget
    ) => {
        try {
            const updated = await updatePersonalBudget(
                updatedBudget._id || "No id",
                updatedBudget
            );
            setPersonalBudget(updated);
            handleCloseEditBudget();
        } catch (error) {
            console.error("Error updating personal budget:", error);
        }
    };

    const handleRefresh = () => {
        setRefresh((prev) => !prev);
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getPersonalBudgetInfo();
            setLoading(false);
        };
        getData();
    }, [month, year, refresh]);

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
                onRefresh={handleRefresh}
            />
        );
    }

    if (isEditBudgetOpen && personalBudget) {
        return (
            <PersonalBudgetForm
                initialBudget={personalBudget}
                month={month}
                year={year}
                familyCategories={familyCategories}
                onCreateBudget={handleUpdatePersonalBudget}
                onRefresh={handleRefresh}
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
                        isPersonal={true}
                    />
                    {personalSpendings.length > 0 ? (
                        <BudgetSpendings
                            spendings={personalSpendings}
                            onUpdateSpendings={handleOpenSpendingsModal}
                            onDeleteSpendings={handleDeleteSpendings}
                            canModify={true}
                        />
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

            <button
                onClick={() => handleOpenSpendingsModal()}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
                Přidat osobní plán výdajů
            </button>

            {isSpendingsModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">
                            {updatingSpendings
                                ? "Upravit plán výdajů"
                                : "Přidat nový plán výdajů"}
                        </h3>
                        <SpendingsForm
                            onAddSpendings={handleAddSpendings}
                            initialSpendings={updatingSpendings || undefined}
                            isPersonal={true}
                            familyCategories={familyCategories}
                        />
                        <button
                            onClick={handleCloseSpendingsModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}

            {personalTransactions.length > 0 ? (
                <Transactions
                    transactions={personalTransactions}
                    familyCategories={familyCategories}
                    onUpdateTransaction={handleOpenTransactionModal}
                    onDeleteTransaction={handleDeleteTransaction}
                />
            ) : (
                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                    Transakce nejsou k dispozici.
                </h3>
            )}

            <button
                onClick={() => handleOpenTransactionModal()}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
                Přidat transakci
            </button>
            <button
                onClick={handleOpenEditBudget}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Upravit rozpočet
            </button>

            {isTransactionModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">
                            {updatingTransaction
                                ? "Upravit transakci"
                                : "Přidat novou transakci"}
                        </h3>
                        <TransactionForm
                            onAddTransaction={handleAddTransaction}
                            initialTransaction={
                                updatingTransaction || undefined
                            }
                            familyCategories={familyCategories}
                        />
                        <button
                            onClick={handleCloseTransactionModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Personal;
