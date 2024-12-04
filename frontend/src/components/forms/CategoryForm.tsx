import { useState } from "react";
import { Category } from "../../types/category";

interface CategoryFormProps {
    onAddCategory: (category: Category) => void;
    initialCategory?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    onAddCategory,
    initialCategory,
}) => {
    const defaultCategory = {
        name: "",
        reductionRate: 0,
        isExpense: true,
        isGlobal: false,
    };
    const [category, setCategory] = useState<Category>(
        initialCategory || defaultCategory
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setCategory({
            ...category,
            [name]: type === "checkbox" ? e.target.checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(category);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Název</label>
                <input
                    type="text"
                    name="name"
                    value={category.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Míra snížení (%)
                </label>
                <input
                    type="number"
                    max={100}
                    name="reductionRate"
                    value={category.reductionRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Procento, o které lze snížit výdaje v této kategorii při
                    optimalizaci rozpočtu (0-100 %).
                </p>
            </div>
            <div className="mb-4">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        name="isExpense"
                        checked={category.isExpense}
                        onChange={handleInputChange}
                        className="form-checkbox"
                    />
                    <span className="ml-2">Výdaj</span>
                </label>
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {initialCategory ? "Upravit kategorii" : "Přidat kategorii"}
            </button>
        </form>
    );
};

export default CategoryForm;
