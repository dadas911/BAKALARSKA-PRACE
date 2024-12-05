import { useEffect, useState } from "react";
import FinancialGoalAnalysisForm from "../components/forms/FinancialGoalAnalysisForm";
import { FinancialGoal } from "../types/financial-goal";
import Loading from "../components/common/Loading";
import { getHasPersonalBudget } from "../api/personal-budget-api";
import {
    getFamilyFinancialGoals,
    getPersonalFinancialGoals,
} from "../api/financial-goal-api";
import { getHasFamilyAccount } from "../api/family-account-api";
import { getHasFamilyBudget } from "../api/family-budget-api";
import RiskAnalysis from "../components/analysis/RiskAnalysis";

const Analysis = () => {
    const [isFinancialGoalModalOpen, setIsFinancialGoalModalOpen] =
        useState(false);

    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);

    const [personalFinancialGoals, setPersonalFinancialGoals] = useState<
        FinancialGoal[]
    >([]);
    const [familyFinancialGoals, setFamilyFinancialGoals] = useState<
        FinancialGoal[]
    >([]);

    const [currFinancialGoals, setCurrFinancialGoals] = useState<
        FinancialGoal[]
    >([]);

    const [
        isPersonalFinancialGoalAnalysis,
        setIsPersonalFinancialGoalAnalysis,
    ] = useState<boolean>(false);

    const handleOpenFinancialGoalModal = (isPersonal: boolean) => {
        if (isPersonal) {
            setCurrFinancialGoals(personalFinancialGoals);
        } else {
            setCurrFinancialGoals(familyFinancialGoals);
        }
        setIsPersonalFinancialGoalAnalysis(isPersonal);
        setIsFinancialGoalModalOpen(true);
    };

    const handleCloseFinancialGoalModal = () =>
        setIsFinancialGoalModalOpen(false);

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const getFinancialGoalsInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget(month, year);

        if (personalBudgetStatus) {
            const pGoals = await getPersonalFinancialGoals();
            if (pGoals) {
                setPersonalFinancialGoals(pGoals);
            }
        }

        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);
        if (familyAccountStatus) {
            const familyBudgetStatus = await getHasFamilyBudget(month, year);
            if (familyBudgetStatus) {
                const fGoals = await getFamilyFinancialGoals();
                if (fGoals) {
                    setFamilyFinancialGoals(fGoals);
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
        console.log("use effect in analysis");
        getData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-8">
            <RiskAnalysis hasFamilyAccount={hasFamilyAccount} />

            <div className="p-4 shadow-md sm:rounded-lg bg-white">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-4 text-center">
                    Analýza finančních cílů
                </h2>
                <div className="flex flex-col gap-3">
                    <p className="text-neutral-600 leading-relaxed">
                        <strong>Analýza finančních cílů</strong> vám pomůže
                        sledovat a vyhodnotit, zda jste na správné cestě k
                        jejich úspěšnému dosažení. Stačí si vybrat již vytvořený
                        osobní či rodinný finanční cíl a zadat částku, kterou na
                        něj plánujete měsíčně přispět. Aplikace následně
                        spočítá, jestli zadaný měsíční příspěvek bude stačit na
                        jeho včasné splnění. Pokud ne, dostanete návrhy, jak
                        upravit příspěvky nebo rozpočet. Díky tomu můžete své
                        finanční cíle lépe plánovat a přizpůsobovat je své
                        finanční situaci.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-6">
                        <button
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto"
                            onClick={() => handleOpenFinancialGoalModal(true)}
                        >
                            Analýza osobních cílů
                        </button>
                        {hasFamilyAccount && (
                            <button
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto"
                                onClick={() =>
                                    handleOpenFinancialGoalModal(false)
                                }
                            >
                                Analýza rodinných cílů
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isFinancialGoalModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 w-96">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Analýza{" "}
                            {isPersonalFinancialGoalAnalysis
                                ? "osobních"
                                : "rodinných"}{" "}
                            cílů
                        </h3>
                        <FinancialGoalAnalysisForm
                            isPersonal={isPersonalFinancialGoalAnalysis}
                            goals={currFinancialGoals}
                        />
                        <button
                            onClick={handleCloseFinancialGoalModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analysis;
