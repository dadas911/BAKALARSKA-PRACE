import { useState } from "react";
import { Category } from "../../types/category";

interface SmartSpendingsFormProps {
    familyCategories: Category[];
    onCalculateSpendings: (spendingsPerCategory: {
        [key: string]: number;
    }) => void;
}

const SmartSpendingsForm: React.FC<SmartSpendingsFormProps> = ({
    familyCategories,
    onCalculateSpendings,
}) => {
    const [spendingsPerCategory, setspendingsPerCategory] = useState<{
        [key: string]: number;
    }>(
        familyCategories.reduce((acc, category) => {
            if (category._id) {
                acc[category._id] = 0;
            }
            return acc;
        }, {} as { [key: string]: number })
    );

    const handleAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        categoryId: string
    ) => {
        setspendingsPerCategory({
            ...spendingsPerCategory,
            [categoryId]: Number(e.target.value),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculateSpendings(spendingsPerCategory);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className="text-center">
                <p className="text-neutral-700 mt-2">
                    Tento vzorec vypočítá výdaje pro rodinu a její členy na
                    základě příjmů, priorit a flexibility každého člena. Zadejte
                    maximální částky, které plánujete vynaložit na jednotlivé
                    kategorie.
                </p>
            </div>

            {familyCategories
                .filter((category) => category.isExpense === true) // Filtrování podle isExpense
                .map((category) => (
                    <div
                        key={category._id}
                        className="flex items-center space-x-4"
                    >
                        <label className="text-sm font-medium w-1/3">
                            {category.name}:
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={
                                category._id &&
                                spendingsPerCategory[category._id]
                            }
                            onChange={(e) =>
                                handleAmountChange(e, category._id || "no Id")
                            }
                            className="w-2/3 px-3 py-2 border rounded"
                        />
                    </div>
                ))}

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
            >
                Vypočítat plán výdajů
            </button>
        </form>
    );
};

export default SmartSpendingsForm;
