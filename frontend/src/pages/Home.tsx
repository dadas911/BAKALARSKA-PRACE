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

const Home = () => {
    const [hasPersonalBudget, setHasPersonalBudget] = useState<boolean>(false);
    const [personalBudget, setPersonalBudget] = useState<PersonalBudget | null>(
        null
    );
    const [personalSpendings, setPersonalSpendings] = useState<
        Spendings[] | null
    >(null);

    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);
    const [hasFamilyBudget, setHasFamilyBudget] = useState<boolean>(false);

    const [familyBudget, setFamilyBudget] = useState<FamilyBudget | null>(null);
    const [familySpendings, setFamilySpendings] = useState<Spendings[] | null>(
        null
    );

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
        return (
            <div>
                <h2>Načítání...</h2>
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
            <h1>Přehled osobních financí</h1>
            {hasPersonalBudget ? (
                <>
                    {personalBudget ? (
                        <div>
                            <h2>Shrnutí osobního rozpočtu</h2>
                            <h3>{personalBudget.name}</h3>
                            <p>
                                Zůstatek:{" "}
                                {personalBudget.income + personalBudget.expense}
                                , Příjem: {personalBudget.income}, Výdaje:{" "}
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
                </>
            ) : (
                <div>
                    <h2>Osobní rozpočet pro tento měsíc není k dispozici</h2>
                </div>
            )}
            <h1>Přehled rodinných financí</h1>
            {hasFamilyBudget ? (
                <>
                    {familyBudget ? (
                        <div>
                            <h2>Shrnutí rodinného rozpočtu</h2>
                            <h3>{familyBudget.name}</h3>
                            <p>
                                Zůstatek:{" "}
                                {familyBudget.income + familyBudget.expense},
                                Příjem: {familyBudget.income}, Výdaje:{" "}
                                {familyBudget.expense}
                            </p>
                        </div>
                    ) : (
                        <p>Shrnutí rodinného účtu není k dispozici.</p>
                    )}

                    {familySpendings ? (
                        <div>
                            <h3>Výdaje</h3>
                            {familySpendings.map((spending) => (
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
                </>
            ) : (
                <div>
                    <h2>Rodinný rozpočet pro tento měsíc není k dispozici</h2>
                </div>
            )}
        </div>
    );
};

export default Home;
