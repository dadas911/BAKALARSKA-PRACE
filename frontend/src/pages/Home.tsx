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
    //Initialize all needed hooks
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

    //Function for getting all personal budget info
    const getPersonalBudgetInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget(month, year);
        setHasPersonalBudget(personalBudgetStatus);

        if (personalBudgetStatus) {
            const budget = await getPersonalBudgetByMonth(month, year);
            const spendings = await getPersonalSpendingsByMonth(month, year);
            setPersonalBudget(budget);
            setPersonalSpendings(spendings);
        }
    };

    //Function for getting all family budget info
    const getFamilyBudgetInfo = async () => {
        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);

        if (familyAccountStatus) {
            const familyBudgetStatus = await getHasFamilyBudget(month, year);
            setHasFamilyBudget(familyBudgetStatus);

            if (familyBudgetStatus) {
                const budget = await getFamilyBudgetByMonth(month, year);
                const spendings = await getFamilySpendingsByMonth(month, year);
                setFamilyBudget(budget);
                setFamilySpendings(spendings);
            }
        }
    };

    //Get personal and family budget info while loading is displayed
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

    //Display all needed components based on hooks and states
    return (
        <div className="flex flex-col gap-4">
            <DatePicker
                month={month}
                year={year}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />
            <h2 className="text-3xl font-semibold text-neutral-700 text-center">
                Přehled osobních financí
            </h2>
            {hasPersonalBudget ? (
                <>
                    {personalBudget ? (
                        <BudgetBalance
                            name={personalBudget.name}
                            income={personalBudget.income}
                            expense={personalBudget.expense}
                            isPersonal={true}
                        />
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Shrnutí osobního účtu není k dispozici.
                        </h3>
                    )}

                    {personalSpendings.length > 0 ? (
                        <BudgetSpendings
                            spendings={personalSpendings}
                            onDeleteSpendings={() => null}
                            onUpdateSpendings={() => null}
                            canModify={false}
                        />
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Výdaje nejsou k dispozici.
                        </h3>
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
                Přehled rodinných financí
            </h2>
            {hasFamilyAccount ? (
                hasFamilyBudget ? (
                    <>
                        {familyBudget ? (
                            <BudgetBalance
                                name={familyBudget.name}
                                income={familyBudget.income}
                                expense={familyBudget.expense}
                                isPersonal={false}
                            />
                        ) : (
                            <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                                Shrnutí rodinného účtu není k dispozici.
                            </h3>
                        )}

                        {familySpendings.length > 0 ? (
                            <BudgetSpendings
                                spendings={familySpendings}
                                onDeleteSpendings={() => null}
                                onUpdateSpendings={() => null}
                                canModify={false}
                            />
                        ) : (
                            <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                                Výdaje nejsou k dispozici.
                            </h3>
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

export default Home;
