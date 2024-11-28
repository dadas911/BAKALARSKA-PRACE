import { useState, useEffect } from "react";
import UserPicker from "../components/common/UserPicker";
import DatePicker from "../components/common/DatePicker";
import BudgetBalance from "../components/budget/BudgetBalance";
import BudgetSpendings from "../components/budget/Spendings";
import { getUserById } from "../api/user-api";
import { User } from "../types/user";
import { getFamilyMemberBudgetByMonth } from "../api/personal-budget-api";
import { getFamilyMemberSpendingsByMonth } from "../api/spendings-api";
import Loading from "../components/common/Loading";
import { getAllAccountUsers } from "../api/family-account-api";

const FamilyMemberBudget = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [familyMemberBudget, setFamilyMemberBudget] = useState<any>(null);
    const [familyMemberSpendings, setFamilyMemberSpendings] = useState<any[]>(
        []
    );
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    const handleUserChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const user = await getUserById(e.target.value);
        setSelectedUser(user);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
    };

    // Funkce pro změnu roku
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    const getFamilyMemberBudgetData = async () => {
        if (selectedUser) {
            const memberBudget = await getFamilyMemberBudgetByMonth(
                selectedUser._id || "No id for user",
                month,
                year
            );
            setFamilyMemberBudget(memberBudget);

            if (memberBudget) {
                const memberSpendings = await getFamilyMemberSpendingsByMonth(
                    selectedUser._id || "No id for user",
                    month,
                    year
                );

                setFamilyMemberSpendings(memberSpendings);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const users = await getAllAccountUsers();
            setUsers(users);
            await getFamilyMemberBudgetData();
            setLoading(false);
        };

        getData();
    }, [selectedUser, month, year]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4">
            <UserPicker
                users={users}
                onUserChange={handleUserChange}
                selectedUserId={selectedUser?._id || "DEFAULT"}
            />

            {selectedUser && (
                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-3xl font-semibold text-neutral-700 text-center">
                        Přehled rozpočtu uživatele {selectedUser.username}
                    </h2>
                    <DatePicker
                        month={month}
                        year={year}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                    />

                    {familyMemberBudget ? (
                        <>
                            <BudgetBalance
                                name={familyMemberBudget.name}
                                income={familyMemberBudget.income}
                                expense={familyMemberBudget.expense}
                                isPersonal={true}
                            />
                            {familyMemberSpendings.length > 0 ? (
                                <BudgetSpendings
                                    spendings={familyMemberSpendings}
                                    onUpdateSpendings={() => {}}
                                    onDeleteSpendings={() => {}}
                                />
                            ) : (
                                <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                                    Výdaje člena rodiny nejsou k dispozici.
                                </h3>
                            )}
                        </>
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Shrnutí účtu člena rodiny není k dispozici.
                        </h3>
                    )}
                </div>
            )}
        </div>
    );
};

export default FamilyMemberBudget;
