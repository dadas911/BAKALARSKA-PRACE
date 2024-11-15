import { useEffect, useState } from "react";
import { Spendings } from "../types/spendings";
import { FamilyBudget } from "../types/family-budget";
import {
    getFamilyBudgetByMonth,
    getHasFamilyBudget,
} from "../api/family-budget-api";
import {
    createSpendings,
    getFamilySpendingsByMonth,
} from "../api/spendings-api";
import { getHasFamilyAccount } from "../api/family-account-api";
import { Category } from "../types/category";
import { createCategory, getAllFamilyCategories } from "../api/category-api";

const Family = () => {
    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);
    const [hasFamilyBudget, setHasFamilyBudget] = useState<boolean>(false);

    const [familyBudget, setFamilyBudget] = useState<FamilyBudget | null>(null);
    const [familySpendings, setFamilySpendings] = useState<Spendings[]>([]);

    const [newCategory, setNewCategory] = useState<Category>({
        name: "",
        isGlobal: false,
        isExpense: true,
    });

    const [newSpendings, setNewSpendings] = useState<Spendings>({
        name: "",
        totalAmount: 0,
        spentAmount: 0,
        category: "",
        isPersonal: false,
    });

    const [familyCategories, setFamilyCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const date = new Date();

    const [month, setMonth] = useState<number>(date.getMonth() + 1);
    const [year, setYear] = useState<number>(date.getFullYear());

    const getFamilyBudgetInfo = async () => {
        const familyAccountStatus = await getHasFamilyAccount();
        setHasFamilyAccount(familyAccountStatus);

        if (familyAccountStatus) {
            const familyBudgetStatus = await getHasFamilyBudget();
            setHasFamilyBudget(familyBudgetStatus);

            if (familyBudgetStatus) {
                const budget = await getFamilyBudgetByMonth(month, year);
                const spendings = await getFamilySpendingsByMonth(month, year);
                const category = await getAllFamilyCategories();

                setFamilyBudget(budget);
                setFamilySpendings(spendings);
                setFamilyCategories(category);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getFamilyBudgetInfo();
            setLoading(false);
        };

        getData();
    }, [month, year, hasFamilyAccount, hasFamilyBudget]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    function handleSpendingsChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setNewSpendings({
            ...newSpendings,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSpendingsSubmit(e: React.FormEvent) {
        e.preventDefault();
        let response = await createSpendings(newSpendings);
        if (response) {
            setFamilySpendings((prevSpendings) => [...prevSpendings, response]);
        } else {
            alert("Chyba při vytváření výdaje");
        }
    }

    function handleCategoryChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setNewCategory({
            ...newCategory,
            [name]: name === "isExpense" ? value === "true" : value, // Převod na boolean pro isExpense
        });
    }
    async function handleCategorySubmit(e: React.FormEvent) {
        e.preventDefault();
        let response = await createCategory(newCategory);
        if (response) {
            setFamilyCategories((prevCategories) => [
                ...prevCategories,
                response,
            ]);
        } else {
            alert("Chyba při vytváření kategorie");
        }
    }

    if (loading) {
        return <h2>Načítání...</h2>;
    }

    if (!hasFamilyAccount) {
        return (
            <div>
                <h2>Tento účet nemá rodinný účet</h2>
            </div>
        );
    }

    if (!hasFamilyBudget) {
        return (
            <div>
                <h2>Rodinný účet pro tento měsíc není vytvořený</h2>
            </div>
        );
    }

    return (
        <div>
            <div>
                <label htmlFor="month">Vyberte měsíc:</label>
                <select id="month" value={month} onChange={handleMonthChange}>
                    <option value={1}>Leden</option>
                    <option value={2}>Únor</option>
                    <option value={3}>Březen</option>
                    <option value={4}>Duben</option>
                    <option value={5}>Květen</option>
                    <option value={6}>Červen</option>
                    <option value={7}>Červenec</option>
                    <option value={8}>Srpen</option>
                    <option value={9}>Září</option>
                    <option value={10}>Říjen</option>
                    <option value={11}>Listopad</option>
                    <option value={12}>Prosinec</option>
                </select>
            </div>

            <div>
                <label htmlFor="year">Vyberte rok:</label>
                <select id="year" value={year} onChange={handleYearChange}>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                </select>
            </div>

            {familyBudget ? (
                <div>
                    <h2>Shrnutí rodinného rozpočtu</h2>
                    <h3>{familyBudget.name}</h3>
                    <p>
                        Zůstatek: {familyBudget.income + familyBudget.expense},
                        Příjem: {familyBudget.income}, Výdaje:{" "}
                        {familyBudget.expense}
                    </p>
                </div>
            ) : (
                <p>Shrnutí rodinného účtu není k dispozici.</p>
            )}

            {familySpendings.length > 0 ? (
                <div>
                    <h3>Výdaje</h3>
                    {familySpendings.map((spending) => (
                        <p key={spending._id}>
                            Name: {spending.name}, TotalAmount:{" "}
                            {spending.totalAmount}, SpentAmount:{" "}
                            {spending.spentAmount}
                        </p>
                    ))}
                </div>
            ) : (
                <p>Výdaje nejsou k dispozici.</p>
            )}

            <h4>Vytvořit nový plán výdaje</h4>
            <form onSubmit={handleSpendingsSubmit}>
                <input
                    placeholder={"Name"}
                    onChange={handleSpendingsChange}
                    name="name"
                    required
                    maxLength={50}
                />
                <input
                    placeholder={"Total amount"}
                    onChange={handleSpendingsChange}
                    name="totalAmount"
                    required
                    type="number"
                    maxLength={10}
                />
                Kategorie:
                {familyCategories.length > 0 ? (
                    <select
                        name="category"
                        defaultValue="DEFAULT"
                        onChange={handleSpendingsChange}
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
                    <p>Žádné kategorie k dispozici.</p>
                )}
                <button type="submit">Přidat výdaje</button>
            </form>

            {familyCategories.length > 0 ? (
                <div>
                    <h3>Rodinné kategorie</h3>
                    {familyCategories.map((category) => (
                        <p key={category._id}>
                            Name: {category.name}, typ:{" "}
                            {category.isExpense ? "Výdaj" : "Příjem"}
                        </p>
                    ))}
                </div>
            ) : (
                <p>Transakce nejsou k dispozici.</p>
            )}

            <form onSubmit={handleCategorySubmit}>
                <input
                    placeholder={"Name"}
                    onChange={handleCategoryChange}
                    name="name"
                    required
                    maxLength={20}
                />
                <select name="isExpense">
                    <option value="true">Výdaj</option>
                    <option value="false">Příjem</option>
                </select>
                <button type="submit">Vytvořit kategorii</button>
            </form>
        </div>
    );
};

export default Family;
