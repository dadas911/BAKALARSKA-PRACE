import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { FamilyBudget } from "../types/family-budget";
import {
    getFamilyBudgetByMonth,
    getHasFamilyBudget,
} from "../api/family-budget-api";
import {
    createSmartSpendings,
    createSpendings,
    deleteSpendings,
    getFamilySpendingsByMonth,
    updateSpendings,
} from "../api/spendings-api";
import { getHasFamilyAccount } from "../api/family-account-api";
import { Category } from "../types/category";
import {
    createCategory,
    deleteCategory,
    getAllFamilyCategories,
    updateCategory,
} from "../api/category-api";
import DatePicker from "../components/common/DatePicker";
import Loading from "../components/common/Loading";
import FamilyCategory from "../components/family/FamilyCategory";
import CategoryForm from "../components/forms/CategoryForm";
import BudgetBalance from "../components/budget/BudgetBalance";
import BudgetSpendings from "../components/budget/Spendings";
import FamilyBudgetForm from "../components/forms/FamilyBudgetForm";
import SpendingsForm from "../components/forms/SpendingsForm";
import { checkUserRole } from "../api/user-api";
import SmartSpendingsForm from "../components/forms/SmartSpendingsForm";

const Family = () => {
    //Setting up all needed hok
    const [refresh, setRefresh] = useState(false);

    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);
    const [hasFamilyBudget, setHasFamilyBudget] = useState<boolean>(false);

    const [familyBudget, setFamilyBudget] = useState<FamilyBudget | null>(null);
    const [familySpendings, setFamilySpendings] = useState<Spendings[]>([]);

    const [familyCategories, setFamilyCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const date = new Date();
    const [month, setMonth] = useState<number>(date.getMonth() + 1);
    const [year, setYear] = useState<number>(date.getFullYear());

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [updatingCategory, setUpdatingCategory] = useState<Category | null>(
        null
    );

    const [isSpendingsModalOpen, setIsSpendingsModalOpen] = useState(false);
    const [updatingSpendings, setUpdatingSpendings] =
        useState<Spendings | null>(null);

    const [isProvider, setIsProvider] = useState<boolean>(false);
    const [isFamilyMember, setIsFamilyMember] = useState<boolean>(false);

    const [isSmartSpendingsModalOpen, setIsSmartSpendingsModalOpen] =
        useState<boolean>(false);

    //Function for getting all family budget info
    const getFamilyBudgetInfo = async () => {
        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);

        if (familyAccountStatus) {
            const familyBudgetStatus = await getHasFamilyBudget(month, year);
            setHasFamilyBudget(familyBudgetStatus);

            if (familyBudgetStatus) {
                const budget = await getFamilyBudgetByMonth(month, year);
                const spendings = await getFamilySpendingsByMonth(month, year);
                const provider = await checkUserRole("živitel");
                const member = await checkUserRole("člen domácnosti");

                setFamilyBudget(budget);
                setFamilySpendings(spendings);
                setIsProvider(provider);
                setIsFamilyMember(member);
            }
            const category = await getAllFamilyCategories();
            setFamilyCategories(category);
        }
    };

    const handleOpenSpendingsModal = (spendings?: Spendings) => {
        setUpdatingSpendings(spendings || null);
        setIsSpendingsModalOpen(true);
    };

    const handleCloseSpendingsModal = () => {
        setUpdatingSpendings(null);
        setIsSpendingsModalOpen(false);
    };

    //Function for handling add/update spending
    const handleAddSpendings = async (newSpendings: Spendings) => {
        if (updatingSpendings) {
            updateSpendings(newSpendings._id || "No id", newSpendings);
            setFamilySpendings((prevSpendings) =>
                prevSpendings.map((spendings) =>
                    spendings._id === updatingSpendings._id
                        ? newSpendings
                        : spendings
                )
            );
        } else {
            const rensponseSpendings = await createSpendings(
                newSpendings,
                month,
                year
            );
            if (rensponseSpendings) {
                setFamilySpendings((prevSpendings) => [
                    ...prevSpendings,
                    rensponseSpendings,
                ]);
            }
        }

        handleCloseSpendingsModal();
    };

    //Function for handling delete spendings
    const handleDeleteSpendings = async (id: string) => {
        try {
            await deleteSpendings(id);
            setFamilySpendings((prevSpendings) =>
                prevSpendings.filter((spendings) => spendings._id !== id)
            );
        } catch (error) {
            console.error("Error deleting spendings:" + error);
        }
    };

    const handleOpenCategoryModal = (category?: Category) => {
        setUpdatingCategory(category || null);
        setIsCategoryModalOpen(true);
    };

    const handleCloseCategoryModal = () => {
        setUpdatingCategory(null);
        setIsCategoryModalOpen(false);
    };

    //Function for handling add/update category
    const handleAddCategory = async (newCategory: Category) => {
        if (updatingCategory) {
            updateCategory(newCategory._id || "No id", newCategory);
            setFamilyCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category._id === updatingCategory._id
                        ? newCategory
                        : category
                )
            );
        } else {
            const responseCategory = await createCategory(newCategory);
            if (responseCategory) {
                setFamilyCategories((prevCategories) => [
                    ...prevCategories,
                    responseCategory,
                ]);
            }
        }
        handleCloseCategoryModal();
    };

    //Function for handling delete category
    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            setFamilyCategories((prevCategories) =>
                prevCategories.filter((category) => category._id !== id)
            );
        } catch (error) {
            console.error("Error deleting category:" + error);
        }
    };

    const handleRefresh = () => {
        setRefresh((prev) => !prev);
    };

    const handleOpenSmartSpendingsModal = () => {
        setIsSmartSpendingsModalOpen(true);
    };

    const handleCloseSmartSpendingsModal = () => {
        setIsSmartSpendingsModalOpen(false);
    };

    //Function for calculating and creating personal and family spendings based on "smart" formula
    const handleCalculateSmartSpendings = async (spendingsPerCategory: {
        [key: string]: number;
    }) => {
        handleCloseSmartSpendingsModal();
        const responseSpendings = await createSmartSpendings(
            spendingsPerCategory
        );
        if (responseSpendings.success) {
            if (responseSpendings.data) {
                const newSpendings = familySpendings.concat(
                    responseSpendings.data
                );
                setFamilySpendings(newSpendings);
            }
        } else {
            alert(responseSpendings.message);
        }
    };

    //Get all family budget info while displaying loading
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getFamilyBudgetInfo();
            setLoading(false);
        };

        getData();
    }, [month, year, refresh]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    if (loading) {
        return <Loading />;
    }

    //No family account -> display message
    if (!hasFamilyAccount) {
        return (
            <div className="flex justify-center items-center">
                <h2 className="text-2xl font-semibold text-red-700 text-center px-4 py-2 mt-40">
                    Uživatel není členem žádného rodinného účtu.
                    <br />
                    Vytvořit ho můžete v záložce
                    <span className="font-bold"> "Uživatel a Rodina"</span>.
                </h2>
            </div>
        );
    }

    //No family budget -> display family budget form
    if (!hasFamilyBudget) {
        return (
            <div className="flex flex-col gap-4">
                <DatePicker
                    month={month}
                    year={year}
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                />
                <FamilyBudgetForm
                    month={month}
                    year={year}
                    onCreateBudget={setFamilyBudget}
                    refresh={handleRefresh}
                />
            </div>
        );
    }

    //Display all needed components based on hooks and states
    return (
        <div className="flex flex-col gap-4">
            <DatePicker
                month={month}
                year={year}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />

            {familyBudget ? (
                <>
                    <BudgetBalance
                        name={familyBudget.name}
                        income={familyBudget.income}
                        expense={familyBudget.expense}
                        isPersonal={false}
                    />
                    {familySpendings.length > 0 ? (
                        <BudgetSpendings
                            spendings={familySpendings}
                            onUpdateSpendings={handleOpenSpendingsModal}
                            onDeleteSpendings={handleDeleteSpendings}
                            canModify={isProvider || isFamilyMember}
                        />
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Výdaje nejsou k dispozici.
                        </h3>
                    )}
                </>
            ) : (
                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                    Shrnutí rodinného účtu není k dispozici.
                </h3>
            )}
            {(isProvider || isFamilyMember) && (
                <div className="flex w-full space-x-4 mt-4">
                    {year === date.getFullYear() &&
                    month === date.getMonth() + 1 ? (
                        <>
                            <button
                                onClick={() => handleOpenSpendingsModal()}
                                className="flex-1 bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Přidat rodinný plán výdajů
                            </button>
                            <button
                                onClick={() => handleOpenSmartSpendingsModal()}
                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Použít inteligentní vzorec
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleOpenSpendingsModal()}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Přidat rodinný plán výdajů
                        </button>
                    )}
                </div>
            )}

            {isSpendingsModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 overflow-y-auto max-h-screen">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            {updatingSpendings
                                ? "Upravit plán výdajů"
                                : "Přidat nový plán výdajů"}
                        </h3>
                        <SpendingsForm
                            onAddSpendings={handleAddSpendings}
                            initialSpendings={updatingSpendings || undefined}
                            isPersonal={false}
                            familyCategories={familyCategories}
                        />
                        <button
                            onClick={handleCloseSpendingsModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}

            {isSmartSpendingsModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 overflow-y-auto max-h-screen">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Inteligentní plán výdajů
                        </h3>
                        <SmartSpendingsForm
                            familyCategories={familyCategories}
                            onCalculateSpendings={handleCalculateSmartSpendings}
                        />
                        <button
                            onClick={handleCloseSmartSpendingsModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}

            {familyCategories.length > 0 ? (
                <FamilyCategory
                    familyCategories={familyCategories}
                    onUpdateCategory={handleOpenCategoryModal}
                    onDeleteCategory={handleDeleteCategory}
                    canModify={isProvider || isFamilyMember}
                />
            ) : (
                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                    Kategorie nejsou k dispozici.
                </h3>
            )}

            {(isProvider || isFamilyMember) && (
                <button
                    onClick={() => handleOpenCategoryModal()}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                    Přidat kategorii
                </button>
            )}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 overflow-y-auto max-h-screen">
                        <h3 className="text-xl font-semibold mb-4">
                            {updatingCategory
                                ? "Upravit kategorii"
                                : "Přidat novou kategorii"}
                        </h3>
                        <CategoryForm
                            onAddCategory={handleAddCategory}
                            initialCategory={updatingCategory || undefined}
                        />
                        <button
                            onClick={handleCloseCategoryModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Zavřít
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Family;
