import { useEffect, useState } from "react";
import { Balance } from "../types/balance";
import { getPersonalBudgetBalance } from "../api/personal-budget-api";

const PersonalBudget = () => {
    // Stav pro ukládání načteného zůstatku
    const [personalBalance, setPersonalBalance] = useState<Balance | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    // Použití useEffect pro načtení dat při prvním vykreslení komponenty
    useEffect(() => {
        const getPersonalBalance = async () => {
            const result = await getPersonalBudgetBalance();
            setPersonalBalance(result);
            setLoading(false);
        };

        getPersonalBalance();
    }, []);

    if (loading) {
        return <div>Načítání...</div>;
    }

    return (
        <div>
            {personalBalance ? (
                <div>
                    <h3>Shrnutí osobního rozpočtu</h3>
                    <p>
                        Zůstatek: {personalBalance.balance}, Příjem:{" "}
                        {personalBalance.income}, Výdaje:{" "}
                        {personalBalance.expense}
                    </p>
                </div>
            ) : (
                <p>Nepodařilo se načíst data.</p>
            )}
        </div>
    );
};

export default PersonalBudget;
