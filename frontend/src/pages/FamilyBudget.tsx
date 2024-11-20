import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { FamilyBudget } from "../types/family-budget";
import {
    getFamilyBudgetByMonth,
    getHasFamilyBudget,
} from "../api/family-budget-api";
import { getFamilySpendingsByMonth } from "../api/spendings-api";
import {
    getFamilyAccount,
    getHasFamilyAccount,
} from "../api/family-account-api";
import { Category } from "../types/category";
import { getAllFamilyCategories } from "../api/category-api";
import { FamilyAccount } from "../types/family-account";
import DatePicker from "../components/common/DatePicker";
import Loading from "../components/common/Loading";
import FamilyCategory from "../components/family/FamilyCategory";
import SpendingsForm from "../components/forms/SpendingsForm";
import CategoryForm from "../components/forms/CategoryForm";
import BudgetBalance from "../components/budget/BudgetBalance";
import BudgetSpendings from "../components/budget/Spendings";
import FamilyBudgetForm from "../components/forms/FamilyBudgetForm";
import FamilyAccountForm from "../components/forms/FamilyAccountForm";

const Family = () => {
    const [refresh, setRefresh] = useState(false);

    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);
    const [hasFamilyBudget, setHasFamilyBudget] = useState<boolean>(false);

    const [familyAccount, setFamilyAccount] = useState<FamilyAccount | null>(
        null
    );
    const [familyBudget, setFamilyBudget] = useState<FamilyBudget | null>(null);
    const [familySpendings, setFamilySpendings] = useState<Spendings[]>([]);

    const [familyCategories, setFamilyCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const date = new Date();

    const [month, setMonth] = useState<number>(date.getMonth() + 1);
    const [year, setYear] = useState<number>(date.getFullYear());

    const getFamilyBudgetInfo = async () => {
        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);

        if (familyAccountStatus) {
            const familyAccount = await getFamilyAccount();
            setFamilyAccount(familyAccount);
            const familyBudgetStatus = await getHasFamilyBudget(month, year);
            setHasFamilyBudget(familyBudgetStatus);

            if (familyBudgetStatus) {
                const budget = await getFamilyBudgetByMonth(month, year);
                const spendings = await getFamilySpendingsByMonth(month, year);

                setFamilyBudget(budget);
                setFamilySpendings(spendings);
            }
            const category = await getAllFamilyCategories();
            setFamilyCategories(category);
        }
    };

    const handleRefresh = () => {
        setRefresh((prev) => !prev);
    };

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

    const handleAddSpendings = (newSpendings: Spendings) => {
        setFamilySpendings((prevSpendings) => [...prevSpendings, newSpendings]);
    };

    const handleAddCategory = (newCategory: Category) => {
        setFamilyCategories((prevCategory) => [...prevCategory, newCategory]);
    };

    const handleCreateFamilyBudget = (newFamilyBudget: FamilyBudget) => {
        setFamilyBudget(newFamilyBudget);
    };

    const handleCreateFamilyAccount = (newFamilyAccount: FamilyAccount) => {
        setFamilyAccount(newFamilyAccount);
    };

    if (loading) {
        return <Loading />;
    }

    if (!hasFamilyAccount) {
        return (
            <FamilyAccountForm
                onCreateAccount={handleCreateFamilyAccount}
                refresh={handleRefresh}
            />
        );
    }

    if (!hasFamilyBudget) {
        return (
            <FamilyBudgetForm
                month={month}
                year={year}
                onCreateBudget={handleCreateFamilyBudget}
                refresh={handleRefresh}
            />
        );
    }

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
                    />
                    {familySpendings.length > 0 ? (
                        <BudgetSpendings spendings={familySpendings} />
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

            {/* <h4>Vytvořit nový plán výdaje</h4>
            <SpendingsForm
                familyCategories={familyCategories}
                isPersonal={false}
                onAddSpendings={handleAddSpendings}
            />*/}

            {familyCategories.length > 0 ? (
                <FamilyCategory familyCategories={familyCategories} />
            ) : (
                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                    Transakce nejsou k dispozici.
                </h3>
            )}

            {/* <h4>Vytvořit novou kategorii</h4>
            <CategoryForm onAddCategory={handleAddCategory} /> */}
        </div>
    );
};

export default Family;
