import { useState } from "react";
import { Category } from "../../types/category";
import { createCategory } from "../../api/category-api";

interface CategoryFormProps {
    onAddCategory: (category: Category) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onAddCategory }) => {
    const defaultCategory = {
        name: "",
        isGlobal: false,
        isExpense: true,
    };
    const [newCategory, setNewCategory] = useState<Category>(defaultCategory);

    function handleCategoryChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setNewCategory({
            ...newCategory,
            [name]: name === "isExpense" ? value === "true" : value,
        });
    }
    async function handleCategorySubmit(e: React.FormEvent) {
        e.preventDefault();
        const response = await createCategory(newCategory);
        if (response) {
            onAddCategory(response);
            setNewCategory(defaultCategory);
        } else {
            alert("Chyba při vytváření kategorie");
        }
    }

    return (
        <form onSubmit={handleCategorySubmit}>
            <input
                placeholder={"Name"}
                onChange={handleCategoryChange}
                name="name"
                required
                value={newCategory.name}
                maxLength={20}
            />
            <select name="isExpense">
                <option value="true">Výdaj</option>
                <option value="false">Příjem</option>
            </select>
            <button type="submit">Vytvořit kategorii</button>
        </form>
    );
};

export default CategoryForm;
