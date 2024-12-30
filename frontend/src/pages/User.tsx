import { useEffect, useState } from "react";
import { User } from "../types/user";
import { FamilyAccount } from "../types/family-account";
import { checkUserRole, getUser } from "../api/user-api";
import {
    addUserToAccount,
    getFamilyAccount,
    getAllAccountUsers,
    removeUserFromAccount,
    getHasFamilyAccount,
} from "../api/family-account-api";
import Loading from "../components/common/Loading";
import FamilyAccountForm from "../components/forms/FamilyAccountForm";

const Account = () => {
    const [refresh, setRefresh] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    const [familyAccount, setFamilyAccount] = useState<FamilyAccount | null>(
        null
    );
    const [accountUsers, setAccountUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [newEmail, setNewEmail] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);
    const [isProvider, setIsProvider] = useState<boolean>(false);

    const getUserInfo = async () => {
        const userData = await getUser();
        setUser(userData);
        if (userData) {
            const familyAccountStatus = await getHasFamilyAccount();
            if (familyAccountStatus) {
                const accountData = await getFamilyAccount();
                setFamilyAccount(accountData);
                const users = await getAllAccountUsers();
                setAccountUsers(users);
                const provider = await checkUserRole("živitel");
                setIsProvider(provider);
            }
        }
    };

    const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
    };

    const handleAddUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roles.length < 1) {
            alert("Vyberte alespoň jednu roli!");
            return;
        }
        const response = await addUserToAccount(newEmail, roles);
        if (response) {
            setNewEmail("");
            handleRefresh();
        } else {
            alert("Chyba při přidání uživatele");
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const role = e.target.value;

        setRoles((prevRole) =>
            e.target.checked
                ? [...prevRole, role]
                : prevRole.filter((currRole) => currRole !== role)
        );
    };

    const handleRemoveUserFromAccount = async (email: string) => {
        await removeUserFromAccount(email);
        const newUsers = accountUsers.filter((user) => user.email !== email);
        setAccountUsers(newUsers);
    };

    const handleRefresh = () => {
        setRefresh((prev) => !prev);
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getUserInfo();
            setLoading(false);
        };

        getData();
    }, [refresh]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="p-4 shadow-md sm:rounded-lg bg-white">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
                    Osobní profil
                </h2>
                <div className="flex flex-col gap-3">
                    <p>
                        <b>Username:</b> {user?.username}
                    </p>
                    <p>
                        <b>Jméno:</b> {user?.firstName}
                    </p>
                    <p>
                        <b>Příjmení:</b> {user?.secondName}
                    </p>
                    <p>
                        <b>E-mail:</b> {user?.email}
                    </p>
                    <p>
                        <b>Role:</b> {user?.role.join(", ")}
                    </p>
                </div>
            </div>
            {familyAccount ? (
                <div className="p-4 shadow-md sm:rounded-lg bg-white">
                    <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
                        Rodinný profil
                    </h2>
                    <p>
                        <b>Jméno účtu:</b> {familyAccount?.name}
                    </p>
                    {isProvider && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-neutral-700 mb-2">
                                Přidat uživatele k rodinnému účtu
                            </h3>
                            <form
                                onSubmit={handleAddUserSubmit}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex gap-2">
                                    <input
                                        placeholder="E-mail"
                                        onChange={handleAddUserChange}
                                        name="email"
                                        type="email"
                                        value={newEmail}
                                        required
                                        maxLength={50}
                                        className="border border-gray-300 p-2 rounded focus:outline-green-500 flex-grow"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                    >
                                        Přidat uživatele
                                    </button>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">
                                        Role přidaného uživatele:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "živitel",
                                            "člen domácnosti",
                                            "student",
                                            "senior",
                                        ].map((role) => (
                                            <label
                                                key={role}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={role}
                                                    checked={roles.includes(
                                                        role
                                                    )}
                                                    onChange={handleRoleChange}
                                                    className="mr-2"
                                                />
                                                {role}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-neutral-700 mb-4">
                            Členové rodinného účtu
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 bg-white">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Username
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Jméno
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-center"
                                        >
                                            Akce
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountUsers.map((currUser) => (
                                        <tr
                                            key={currUser._id}
                                            className="bg-white border-b hover:bg-green-100"
                                        >
                                            <td className="px-6 py-4 font-semibold ">
                                                {currUser.username}
                                            </td>
                                            <td className="px-6 py-4">
                                                {currUser.firstName}{" "}
                                                {currUser.secondName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {currUser?.role.join(", ")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {currUser._id !==
                                                familyAccount.owner ? (
                                                    isProvider ? (
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveUserFromAccount(
                                                                    currUser.email
                                                                )
                                                            }
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            {currUser._id ===
                                                            user?._id
                                                                ? "Opustit"
                                                                : "Odebrat"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Žádné
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Vlastník
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <FamilyAccountForm
                    onCreateAccount={setFamilyAccount}
                    refresh={handleRefresh}
                ></FamilyAccountForm>
            )}
        </div>
    );
};

export default Account;
