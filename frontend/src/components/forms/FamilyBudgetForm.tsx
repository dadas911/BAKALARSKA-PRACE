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
        <form
            onSubmit={handleFamilyBudgetSubmit}
            className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
        >
            <h3 className="text-xl font-semibold mb-6 text-center">
                Vytvořit nový rodinný rozpočet
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
                    id="name"
                    value={newFamilyBudget.name}
                    onChange={handleFamilyBudgetChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Zadejte název rozpočtu"
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

            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition"
            >
                Vytvořit rozpočet
            </button>
        </form>
    );
};

export default FamilyBudgetForm;
