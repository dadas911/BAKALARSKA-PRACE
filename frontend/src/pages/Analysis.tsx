import { useEffect, useState } from "react";
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
import FinancialGoalAnalysis from "../components/analysis/FinancialGoalAnalysis";
import BudgetAnalysis from "../components/analysis/BudgetAnalysis";

const Analysis = () => {
    //Setting up all needed hooks
    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);

    const [personalFinancialGoals, setPersonalFinancialGoals] = useState<
        FinancialGoal[]
    >([]);
    const [familyFinancialGoals, setFamilyFinancialGoals] = useState<
        FinancialGoal[]
    >([]);

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    //Function for getting all financial goals
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

    //Getting all needed info while displaying loading
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getFinancialGoalsInfo();
            setLoading(false);
        };
        getData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    //Display all needed components based on hooks and states
    return (
        <div className="flex flex-col gap-8">
            <RiskAnalysis hasFamilyAccount={hasFamilyAccount} />
            <FinancialGoalAnalysis
                personalFinancialGoals={personalFinancialGoals}
                familyFinancialGoals={familyFinancialGoals}
                hasFamilyAccount={hasFamilyAccount}
            />
            <BudgetAnalysis hasFamilyAccount={hasFamilyAccount} />
        </div>
    );
};

export default Analysis;
