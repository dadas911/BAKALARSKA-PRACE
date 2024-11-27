import { useState } from "react";
import { Spendings } from "../../types/spendings";
import { Category } from "../../types/category";
interface SpendingsFormProps {
    familyCategories: Category[];
    isPersonal: boolean;
    onAddSpendings: (spendings: Spendings) => void;
    initialSpendings?: Spendings;
}

const SpendingsForm: React.FC<SpendingsFormProps> = ({
    familyCategories,
    isPersonal,
    onAddSpendings,
    initialSpendings,
}) => {
    const defaultSpendings = {
        name: "",
        totalAmount: 0,
        spentAmount: 0,
        category: "DEFAULT",
        isPersonal: isPersonal,
    };

    const [spendings, setSpendings] = useState<Spendings>(
        initialSpendings || defaultSpendings
    );

    const handleSpendingsChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setSpendings({
            ...spendings,
            [e.target.name]: e.target.value,
        });
    };

    const handleSpendingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddSpendings(spendings);
    };

    return (
        <form onSubmit={handleSpendingsSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Název</label>
                <input
                    type="text"
                    placeholder="Název"
                    onChange={handleSpendingsChange}
                    name="name"
                    value={spendings.name}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Celková částka
                </label>
                <input
                    type="number"
                    placeholder="Celková částka"
                    onChange={handleSpendingsChange}
                    name="totalAmount"
                    value={spendings.totalAmount}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Kategorie
                </label>
                {familyCategories.length > 0 ? (
                    <select
                        name="category"
                        value={spendings.category}
                        onChange={handleSpendingsChange}
                        defaultValue={spendings.category}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option hidden disabled value="DEFAULT">
                            Vyberte kategorii
                        </option>
                        {familyCategories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p className="text-sm text-gray-500">
                        Žádné kategorie k dispozici.
                    </p>
                )}
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
                {initialSpendings
                    ? "Upravit plán výdajů"
                    : "Přidat plán výdajů"}
            </button>
        </form>
    );
};

export default SpendingsForm;
