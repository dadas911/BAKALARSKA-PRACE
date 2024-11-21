import { useState } from "react";
import { Category } from "../../types/category";

const CategoryForm = ({
    onAddCategory,
    initialCategory,
}: {
    onAddCategory: (category: Category) => void;
    initialCategory?: Category;
}) => {
    const defaultCategory = { name: "", isExpense: true, isGlobal: false };
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
