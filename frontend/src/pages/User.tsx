import { useEffect, useState } from "react";
import { User } from "../types/user";
import { FamilyAccount } from "../types/family-account";
import { getUser } from "../api/user-api";
import {
    addUserToAccount,
    getFamilyAccount,
    getAllAccountUsers,
    removeUserFromAccount,
} from "../api/family-account-api";
import Loading from "../components/common/Loading";

const Account = () => {
    const [refresh, setRefresh] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [familyAccount, setFamilyAccount] = useState<FamilyAccount | null>(
        null
    );
    const [accountUsers, setAccountUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [newEmail, setNewEmail] = useState<String>("");

    const getUserInfo = async () => {
        const userData = await getUser();
        setUser(userData);
        if (userData) {
            if (userData.familyAccount) {
                const accountData = await getFamilyAccount();
                setFamilyAccount(accountData);
                const users = await getAllAccountUsers();
                setAccountUsers(users);
            }
        }
    };

    const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
    };

    const handleAddUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await addUserToAccount(newEmail);
        if (response) {
            setNewEmail("");
            handleRefresh();
        } else {
            alert("Chyba při přidání uživatele");
        }
    };

    const handleRemoveUserFromAccount = async (email: string) => {
        removeUserFromAccount(email);
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
        <>
            <div>
                <h2>Osobní profil</h2>
                <h4>Username: {user?.username}</h4>
                <h4>Jméno: {user?.firstName}</h4>
                <h4>Příjmení: {user?.secondName}</h4>
                <h4>E-mail: {user?.email}</h4>
                <h4>Role: {user?.role}</h4>
            </div>
            {familyAccount ? (
                <>
                    <h2>Rodinný profil</h2>
                    <h4>Jméno účtu: {familyAccount?.name}</h4>
                    <h3>Přidat uživatele k rodinnému účtu</h3>
                    <form onSubmit={handleAddUserSubmit}>
                        <input
                            placeholder={"E-mail"}
                            onChange={handleAddUserChange}
                            name="email"
                            type="email"
                            required
                            maxLength={20}
                        />
                        <button type="submit">Přidat uživatele</button>
                    </form>
                    <h3>Členové rodinného účtu</h3>
                    {accountUsers.map((user) => (
                        <>
                            <p key={user._id}>
                                <b>Username: </b> {user.username},<b> Name: </b>{" "}
                                {user.firstName} {user.secondName},{" "}
                                <b>Role: </b> {user.role}
                            </p>
                            {user._id !== familyAccount.owner && (
                                <button
                                    onClick={() =>
                                        handleRemoveUserFromAccount(user.email)
                                    }
                                >
                                    Odebrat uživatele z účtu
                                </button>
                            )}
                        </>
                    ))}
                </>
            ) : (
                <h3>Uživatel není členem rodinného účtu</h3>
            )}
        </>
    );
};
export default Account;
