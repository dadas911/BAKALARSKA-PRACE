import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { getPersonalSpendingsByMonth } from "../api/spendings-api";
import { PersonalBudget } from "../types/personal-budget";
import {
    getPersonalBudgetByMonth,
    getHasPersonalBudget,
} from "../api/personal-budget-api";
import { FamilyBudget } from "../types/family-budget";
import {
    getFamilyBudgetByMonth,
    getHasFamilyBudget,
} from "../api/family-budget-api";
import { getFamilySpendingsByMonth } from "../api/spendings-api";
import { getHasFamilyAccount } from "../api/family-account-api";
import DatePicker from "../components/common/DatePicker";
import BudgetBalance from "../components/budget/BudgetBalance";
import BudgetSpendings from "../components/budget/Spendings";
import Loading from "../components/common/Loading";

const Home = () => {
    const [hasPersonalBudget, setHasPersonalBudget] = useState<boolean>(false);
    const [personalBudget, setPersonalBudget] = useState<PersonalBudget | null>(
        null
    );
    const [personalSpendings, setPersonalSpendings] = useState<Spendings[]>([]);

    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);
    const [hasFamilyBudget, setHasFamilyBudget] = useState<boolean>(false);

    const [familyBudget, setFamilyBudget] = useState<FamilyBudget | null>(null);
    const [familySpendings, setFamilySpendings] = useState<Spendings[]>([]);

    const [loading, setLoading] = useState(true);

    const date = new Date();
    const [month, setMonth] = useState<number>(date.getMonth() + 1);
    const [year, setYear] = useState<number>(date.getFullYear());

    const getPersonalBudgetInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget();
        setHasPersonalBudget(personalBudgetStatus);

        if (personalBudgetStatus) {
            const budget = await getPersonalBudgetByMonth(month, year);
            const spendings = await getPersonalSpendingsByMonth(month, year);
            setPersonalBudget(budget);
            setPersonalSpendings(spendings);
        }
    };

    const getFamilyBudgetInfo = async () => {
        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);

        if (familyAccountStatus) {
            const familyBudgetStatus = await getHasFamilyBudget();
            setHasFamilyBudget(familyBudgetStatus);

            if (familyBudgetStatus) {
                const budget = await getFamilyBudgetByMonth(month, year);
                const spendings = await getFamilySpendingsByMonth(month, year);
                setFamilyBudget(budget);
                setFamilySpendings(spendings);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getPersonalBudgetInfo();
            await getFamilyBudgetInfo();
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

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <DatePicker
                month={month}
                year={year}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />
            <h1>Přehled osobních financí</h1>
            {hasPersonalBudget ? (
                <>
                    {personalBudget ? (
                        <BudgetBalance
                            name={personalBudget.name}
                            income={personalBudget.income}
                            expense={personalBudget.expense}
                        />
                    ) : (
                        <h3>Shrnutí osobního účtu není k dispozici.</h3>
                    )}

                    {personalSpendings.length > 0 ? (
                        <BudgetSpendings spendings={personalSpendings} />
                    ) : (
                        <h3>Výdaje nejsou k dispozici.</h3>
                    )}
                </>
            ) : (
                <div>
                    <h3>Osobní rozpočet pro tento měsíc není k dispozici</h3>
                </div>
            )}

            <h1>Přehled rodinných financí</h1>
            {hasFamilyAccount ? (
                hasFamilyBudget ? (
                    <>
                        {familyBudget ? (
                            <BudgetBalance
                                name={familyBudget.name}
                                income={familyBudget.income}
                                expense={familyBudget.expense}
                            />
                        ) : (
                            <h3>Shrnutí rodinného účtu není k dispozici.</h3>
                        )}

                        {familySpendings.length > 0 ? (
                            <BudgetSpendings spendings={familySpendings} />
                        ) : (
                            <h3>Výdaje nejsou k dispozici.</h3>
                        )}
                    </>
                ) : (
                    <div>
                        <h3>
                            Rodinný rozpočet pro tento měsíc není k dispozici
                        </h3>
                    </div>
                )
            ) : (
                <div>
                    <h3>K tomuto účtu není přiřazený žádný rodinný účet</h3>
                </div>
            )}
        </div>
    );
};

export default Home;
