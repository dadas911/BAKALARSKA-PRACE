import { useState } from "react";
import { Spendings } from "../../types/spendings";
import { Category } from "../../types/category";
import { createSpendings } from "../../api/spendings-api";

interface SpendingsFormProps {
    familyCategories: Category[];
    isPersonal: boolean;
    onAddSpendings: (spendings: Spendings) => void;
}

const SpendingsForm: React.FC<SpendingsFormProps> = ({
    familyCategories,
    isPersonal,
    onAddSpendings,
}) => {
    const defaultSpendings = {
        name: "",
        totalAmount: 0,
        spentAmount: 0,
        category: "",
        isPersonal: isPersonal,
    };

    const [newSpendings, setNewSpendings] =
        useState<Spendings>(defaultSpendings);

    const handleSpendingsChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewSpendings({
            ...newSpendings,
            [e.target.name]: e.target.value,
        });
    };

    const handleSpendingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createSpendings(newSpendings);
        if (response) {
            onAddSpendings(response);
            setNewSpendings(defaultSpendings);
        } else {
            alert("Chyba při vytváření výdaje");
        }
    };

    return (
        <form onSubmit={handleSpendingsSubmit}>
            <input
                placeholder={"Name"}
                onChange={handleSpendingsChange}
                name="name"
                value={newSpendings.name}
                required
                maxLength={50}
            />
            <input
                placeholder={"Total amount"}
                onChange={handleSpendingsChange}
                name="totalAmount"
                value={newSpendings.totalAmount}
                required
                type="number"
                maxLength={10}
            />
            Kategorie:
            {familyCategories.length > 0 ? (
                <select
                    name="category"
                    value={newSpendings.category}
                    onChange={handleSpendingsChange}
                >
                    <option hidden disabled value="">
                        Vyberte kategorii
                    </option>
                    {familyCategories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            ) : (
                <h3>Žádné kategorie k dispozici.</h3>
            )}
            <button type="submit">Přidat výdaje</button>
        </form>
    );
};

export default SpendingsForm;
