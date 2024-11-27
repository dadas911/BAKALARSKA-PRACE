import { useEffect, useState } from "react";
import { FinancialGoal } from "../types/financial-goal";
import { getHasPersonalBudget } from "../api/personal-budget-api";
import {
    createFinancialGoal,
    getFamilyFinancialGoals,
    getPersonalFinancialGoals,
    updateFinancialGoal,
    deleteFinancialGoal,
} from "../api/financial-goal-api";
import { getHasFamilyAccount } from "../api/family-account-api";
import { getHasFamilyBudget } from "../api/family-budget-api";
import Loading from "../components/common/Loading";
import BudgetFinancialGoals from "../components/budget/BudgetFinancialGoals";
import FinancialGoalForm from "../components/forms/FinancialGoalForm";

const FinancialGoals = () => {
    const [personalGoals, setPersonalGoals] = useState<FinancialGoal[]>([]);
    const [familyGoals, setFamilyGoals] = useState<FinancialGoal[]>([]);
    const [loading, setLoading] = useState(true);

    const [hasPersonalBudget, setHasPersonalBudget] = useState<boolean>(false);
    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);
    const [hasFamilyBudget, setHasFamilyBudget] = useState<boolean>(false);

    const [
        isPersonalFinancialGoalModalOpen,
        setIsPersonalFinancialGoalModalOpen,
    ] = useState(false);
    const [isFamilyFinancialGoalModalOpen, setIsFamilyFinancialGoalModalOpen] =
        useState(false);
    const [updatingFinancialGoal, setUpdatingFinancialGoal] =
        useState<FinancialGoal | null>(null);

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const getFinancialGoalsInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget(month, year);
        setHasPersonalBudget(personalBudgetStatus);

        if (personalBudgetStatus) {
            const pGoals = await getPersonalFinancialGoals();
            if (pGoals) {
                setPersonalGoals(pGoals);
            }
        }

        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);
        if (familyAccountStatus) {
            const familyBudgetStatus = await getHasFamilyBudget(month, year);
            setHasFamilyBudget(familyBudgetStatus);
            if (familyBudgetStatus) {
                const fGoals = await getFamilyFinancialGoals();
                if (fGoals) {
                    setFamilyGoals(fGoals);
                }
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getFinancialGoalsInfo();
            setLoading(false);
        };

        getData();
    }, []);

    const handleOpenPersonalFinancialGoalModal = (
        financialGoal?: FinancialGoal
    ) => {
        setUpdatingFinancialGoal(financialGoal || null);
        setIsPersonalFinancialGoalModalOpen(true);
    };

    const handleClosePersonalFinancialGoalModal = () => {
        setUpdatingFinancialGoal(null);
        setIsPersonalFinancialGoalModalOpen(false);
    };

    const handleOpenFamilyFinancialGoalModal = (
        financialGoal?: FinancialGoal
    ) => {
        setUpdatingFinancialGoal(financialGoal || null);
        setIsFamilyFinancialGoalModalOpen(true);
    };

    const handleCloseFamilyFinancialGoalModal = () => {
        setUpdatingFinancialGoal(null);
        setIsFamilyFinancialGoalModalOpen(false);
    };

    const handleAddPersonalFinancialGoal = async (
        newFinancialGoal: FinancialGoal
    ) => {
        if (updatingFinancialGoal) {
            await updateFinancialGoal(
                newFinancialGoal._id || "No id",
                newFinancialGoal
            );
            setPersonalGoals((prevFinancialGoals) =>
                prevFinancialGoals.map((financialGoal) =>
                    financialGoal._id === updatingFinancialGoal._id
                        ? newFinancialGoal
                        : financialGoal
                )
            );
        } else {
            const rensponseFinancialGoal = await createFinancialGoal(
                newFinancialGoal
            );
            if (rensponseFinancialGoal) {
                setPersonalGoals((prevFinancialGoal) => [
                    ...prevFinancialGoal,
                    rensponseFinancialGoal,
                ]);
            }
        }

        handleClosePersonalFinancialGoalModal();
    };

    const handleAddFamilyFinancialGoal = async (
        newFinancialGoal: FinancialGoal
    ) => {
        if (updatingFinancialGoal) {
            await updateFinancialGoal(
                newFinancialGoal._id || "No id",
                newFinancialGoal
            );
            setFamilyGoals((prevFinancialGoals) =>
                prevFinancialGoals.map((financialGoal) =>
                    financialGoal._id === updatingFinancialGoal._id
                        ? newFinancialGoal
                        : financialGoal
                )
            );
        } else {
            const rensponseFinancialGoal = await createFinancialGoal(
                newFinancialGoal
            );
            if (rensponseFinancialGoal) {
                setFamilyGoals((prevFinancialGoal) => [
                    ...prevFinancialGoal,
                    rensponseFinancialGoal,
                ]);
            }
        }

        handleCloseFamilyFinancialGoalModal();
    };

    const handleDeletePersonalFinancialGoal = async (id: string) => {
        try {
            await deleteFinancialGoal(id);
            setPersonalGoals((prevFinancialGoal) =>
                prevFinancialGoal.filter(
                    (financialGoal) => financialGoal._id !== id
                )
            );
        } catch (error) {
            console.log("Error deleting financialGoal: " + error);
        }
    };

    const handleDeleteFamilyFinancialGoal = async (id: string) => {
        try {
            await deleteFinancialGoal(id);
            setFamilyGoals((prevFinancialGoal) =>
                prevFinancialGoal.filter(
                    (financialGoal) => financialGoal._id !== id
                )
            );
        } catch (error) {
            console.log("Error deleting financialGoal: " + error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold text-neutral-700 text-center">
                Přehled osobních finančních cílů
            </h2>

            {hasPersonalBudget ? (
                <>
                    {personalGoals.length > 0 ? (
                        <BudgetFinancialGoals
                            financialGoals={personalGoals}
                            onUpdateFinancialGoal={
                                handleOpenPersonalFinancialGoalModal
                            }
                            onDeleteFinancialGoal={
                                handleDeletePersonalFinancialGoal
                            }
                        />
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Žádné osobní finanční cíle
                        </h3>
                    )}
                    <button
                        onClick={() => handleOpenPersonalFinancialGoalModal()}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Přidat osobní finanční cíl
                    </button>

                    {isPersonalFinancialGoalModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                                <h3 className="text-xl font-semibold mb-4">
                                    {updatingFinancialGoal
                                        ? "Upravit osobní finanční cíl"
                                        : "Přidat nový osobní finanční cíl"}
                                </h3>
                                <FinancialGoalForm
                                    onAddFinancialGoal={
                                        handleAddPersonalFinancialGoal
                                    }
                                    initialFinancialGoal={
                                        updatingFinancialGoal || undefined
                                    }
                                    isPersonal={true}
                                />
                                <button
                                    onClick={
                                        handleClosePersonalFinancialGoalModal
                                    }
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Zavřít
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                        Osobní rozpočet pro tento měsíc není k dispozici
                    </h3>
                </div>
            )}
            <h2 className="text-3xl font-semibold text-neutral-700 text-center">
                Přehled rodinných finančních cílů
            </h2>

            {hasFamilyAccount ? (
                hasFamilyBudget ? (
                    <>
                        {familyGoals.length > 0 ? (
                            <BudgetFinancialGoals
                                financialGoals={familyGoals}
                                onUpdateFinancialGoal={
                                    handleOpenFamilyFinancialGoalModal
                                }
                                onDeleteFinancialGoal={
                                    handleDeleteFamilyFinancialGoal
                                }
                            />
                        ) : (
                            <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                                Žádné rodinné finanční cíle
                            </h3>
                        )}
                        <button
                            onClick={() => handleOpenFamilyFinancialGoalModal()}
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Přidat rodinný finanční cíl
                        </button>

                        {isFamilyFinancialGoalModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                                    <h3 className="text-xl font-semibold mb-4">
                                        {updatingFinancialGoal
                                            ? "Upravit rodinný finanční cíl"
                                            : "Přidat nový rodinný finanční cíl"}
                                    </h3>
                                    <FinancialGoalForm
                                        onAddFinancialGoal={
                                            handleAddFamilyFinancialGoal
                                        }
                                        initialFinancialGoal={
                                            updatingFinancialGoal || undefined
                                        }
                                        isPersonal={false}
                                    />
                                    <button
                                        onClick={
                                            handleCloseFamilyFinancialGoalModal
                                        }
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Zavřít
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Rodinný rozpočet pro tento měsíc není k dispozici
                        </h3>
                    </div>
                )
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                        K tomuto účtu není přiřazený žádný rodinný účet
                    </h3>
                </div>
            )}
        </div>
    );
};

export default FinancialGoals;
