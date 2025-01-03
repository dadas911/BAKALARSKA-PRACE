import { useState } from "react";
import { Category } from "../../types/category";
import { PersonalBudget } from "../../types/personal-budget";

interface PersonalBudgetFormProps {
    initialBudget?: PersonalBudget;
    month: number;
    year: number;
    familyCategories: Category[];
    onCreateBudget: (newBudget: any) => void;
    onRefresh: () => void;
}

const PersonalBudgetForm: React.FC<PersonalBudgetFormProps> = ({
    initialBudget,
    month,
    year,
    familyCategories,
    onCreateBudget,
    onRefresh,
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
        expectedIncome: 0,
        expense: 0,
        spendings: [],
        flexibility: 1,
        weight: defaultWeight,
    };

    console.log("Weights: " + JSON.stringify(defaultWeight));

    const [newPersonalBudget, setNewPersonalBudget] = useState<PersonalBudget>(
        initialBudget || defaultPersonalBudget
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
        onCreateBudget(newPersonalBudget);
        onRefresh();
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
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                >
                    Očekávaný příjem tento měsíc:
                </label>
                <input
                    type="number"
                    name="expectedIncome"
                    value={newPersonalBudget.expectedIncome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Zadejte očekávaný měsíční příjem"
                    min={0}
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
                    step="0.01"
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
                        value={
                            newPersonalBudget.weight[category.name || "no id"]
                        }
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
                {initialBudget ? "Upravit" : "Vytvořit"} rozpočet
            </button>
        </form>
    );
};

export default PersonalBudgetForm;
