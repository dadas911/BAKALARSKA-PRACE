import { Category } from "../../types/category";

interface FamilyCategoryProps {
    familyCategories: Category[];
}

const FamilyCategory: React.FC<FamilyCategoryProps> = ({
    familyCategories,
}) => (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Rodinné kategorie
        </h3>
        <table className="w-full text-sm text-left text-gray-500 bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Název
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Typ
                    </th>
                </tr>
            </thead>
            <tbody>
                {familyCategories.length > 0 ? (
                    familyCategories.map((category) => (
                        <tr
                            key={category._id}
                            className="bg-white border-b hover:bg-green-100"
                        >
                            <td className="px-6 py-4 font-semibold">
                                {category.name}
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={
                                        category.isExpense
                                            ? "text-red-700"
                                            : "text-green-700"
                                    }
                                >
                                    {category.isExpense ? "Výdaj" : "Příjem"}
                                </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={2}
                            className="px-6 py-4 text-center text-red-700"
                        >
                            Žádné kategorie k dispozici.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default FamilyCategory;
