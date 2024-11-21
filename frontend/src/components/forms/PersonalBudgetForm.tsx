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
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
        >
            <h3 className="text-xl font-semibold mb-6 text-center">
                Vytvořit nový osobní rozpočet
            </h3>

            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                >
                    Název rozpočtu:
                </label>
                <input
                    type="text"
                    name="name"
                    value={newPersonalBudget.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Zadejte název osobního rozpočtu"
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="month"
                    className="block text-sm font-medium mb-1"
                >
                    Měsíc:
                </label>
                <input
                    type="text"
                    id="month"
                    value={monthNames[month - 1]}
                    disabled
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="year"
                    className="block text-sm font-medium mb-1"
                >
                    Rok:
                </label>
                <input
                    type="text"
                    id="year"
                    value={year}
                    disabled
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="flexibility"
                    className="block text-sm font-medium mb-1"
                >
                    Flexibilita:
                </label>
                <input
                    type="number"
                    name="flexibility"
                    value={newPersonalBudget.flexibility}
                    onChange={handleInputChange}
                    min="0"
                    max="1"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <h4 className="text-lg font-semibold mb-4">
                Váhy pro jednotlivé kategorie:
            </h4>
            {expenseCategories.map((category) => (
                <div key={category.name} className="mb-4">
                    <label
                        htmlFor={`weight-${category.name}`}
                        className="block text-sm font-medium mb-1"
                    >
                        {category.name}:
                    </label>
                    <input
                        type="number"
                        name={`weight-${category.name}`}
                        value={newPersonalBudget.weight[category.name]}
                        onChange={handleInputChange}
                        min="0"
                        max="1"
                        step="0.1"
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            ))}

            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg mt-6 hover:bg-green-600 transition"
            >
                Vytvořit rozpočet
            </button>
        </form>
    );
};

export default PersonalBudgetForm;
