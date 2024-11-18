import { Category } from "../../types/category";

interface FamilyCategoryProps {
    familyCategories: Category[];
}

const FamilyCategory: React.FC<FamilyCategoryProps> = ({
    familyCategories,
}) => (
    <div>
        <h3>Rodinné kategorie</h3>
        {familyCategories.map((category) => (
            <p key={category._id}>
                <b>Name:</b> {category.name}, <b>typ:</b>{" "}
                {category.isExpense ? "Výdaj" : "Příjem"}
            </p>
        ))}
    </div>
);

export default FamilyCategory;
