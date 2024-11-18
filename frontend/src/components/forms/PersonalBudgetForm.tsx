import { useState } from "react";
import { Category } from "../../types/category";
import { createPersonalBudget } from "../../api/personal-budget-api";
import { PersonalBudget } from "../../types/personal-budget";

interface PersonalBudgetFormProps {
    month: number;
    year: number;
    familyCategories: Category[];
    onCreateBudget: (newBudget: any) => void;
    refresh: () => void;
}

const PersonalBudgetForm: React.FC<PersonalBudgetFormProps> = ({
    month,
    year,
    familyCategories,
    onCreateBudget,
    refresh,
}) => {
    let expenseCategories = familyCategories.filter(
        (category) => category.isExpense === true
    );

    const defaultWeight = expenseCategories.reduce(
        (acc, category) => ({ ...acc, [category.name]: 1 }),
        {}
    );

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

    const defaultPersonalBudget = {
        name: "",
        month: month,
        year: year,
        income: 0,
        expense: 0,
        spendings: [],
        flexibility: 1,
        weight: defaultWeight,
    };

    const [newPersonalBudget, setNewPersonalBudget] = useState<PersonalBudget>(
        defaultPersonalBudget
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("weight-")) {
            const categoryName = name.split("weight-")[1];

            setNewPersonalBudget({
                ...newPersonalBudget,
                weight: {
                    ...newPersonalBudget.weight,
                    [categoryName]: parseFloat(value),
                },
            });
        } else {
            setNewPersonalBudget({
                ...newPersonalBudget,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createPersonalBudget(newPersonalBudget);
        if (response) {
            onCreateBudget(response);
            setNewPersonalBudget(defaultPersonalBudget);
            refresh();
        } else {
            alert("Chyba při vytváření rozpočtu");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Vytvořit nový osobní rozpočet</h3>
            Název rozpočtu:
            <input
                type="text"
                name="name"
                value={newPersonalBudget.name}
                onChange={handleInputChange}
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
            <input
                type="number"
                name="flexibility"
                value={newPersonalBudget.flexibility}
                onChange={handleInputChange}
                min="0"
                max="1"
                step="0.1"
                required
            />
            <h4>Váhy pro jednotlivé kategorie:</h4>
            {expenseCategories.map((category) => (
                <>
                    {category.name}:
                    <input
                        type="number"
                        name={`weight-${category.name}`}
                        value={newPersonalBudget.weight[category.name]}
                        onChange={handleInputChange}
                        min="0"
                        max="1"
                        step="0.1"
                        required
                    />
                </>
            ))}
            <button type="submit">Vytvořit rozpočet</button>
        </form>
    );
};

export default PersonalBudgetForm;
