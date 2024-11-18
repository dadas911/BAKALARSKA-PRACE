import { useState } from "react";
import { createFamilyBudget } from "../../api/family-budget-api";
import { FamilyBudget } from "../../types/family-budget";

interface FamilyBudgetFormProps {
    month: number;
    year: number;
    onCreateBudget: (newBudget: any) => void;
    refresh: () => void;
}

const FamilyBudgetForm: React.FC<FamilyBudgetFormProps> = ({
    month,
    year,
    onCreateBudget,
    refresh,
}) => {
    const monthNames = [
        "Leden",
        "Únor",
        "Březen",
        "Duben",
        "Květen",
        "Červen",
        "Červenec",
        "Srpen",
        "Září",
        "Říjen",
        "Listopad",
        "Prosinec",
    ];

    const defaultFamilyBudget = {
        name: "",
        month: month,
        year: year,
        income: 0,
        expense: 0,
        spendings: [],
    };

    const [newFamilyBudget, setNewFamilyBudget] =
        useState<FamilyBudget>(defaultFamilyBudget);

    const handleFamilyBudgetChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewFamilyBudget({
            ...newFamilyBudget,
            [e.target.name]: e.target.value,
        });
    };

    const handleFamilyBudgetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createFamilyBudget(newFamilyBudget);
        if (response) {
            onCreateBudget(response);
            setNewFamilyBudget(defaultFamilyBudget);
            refresh();
        } else {
            alert("Chyba při vytváření rozpočtu");
        }
    };

    return (
        <form onSubmit={handleFamilyBudgetSubmit}>
            <h3>Vytvořit nový rodinný rozpočet</h3>
            Název rozpočtu:
            <input
                type="text"
                name="name"
                value={newFamilyBudget.name}
                onChange={handleFamilyBudgetChange}
                required
            />
            Měsíc:
            <input
                type="text"
                id="month"
                value={monthNames[month - 1]}
                disabled
            />
            Rok:
            <input type="text" id="year" value={year} disabled />
            Flexibilita:
            <button type="submit">Vytvořit rozpočet</button>
        </form>
    );
};

export default FamilyBudgetForm;
