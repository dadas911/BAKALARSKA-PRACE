import { useEffect, useState } from "react";
import { User } from "../types/user";
import { FamilyAccount } from "../types/family-account";

const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [familyAccount, setFamilyAccount] = useState<FamilyAccount | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    const getUserInfo = async () => {
        const userData = await getUserInfo();
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getUserInfo();
            setLoading(false);
        };

        getData();
    }, []);

    if (loading) {
        return (
            <div>
                <h2>Načítání...</h2>
            </div>
        );
    }

    return (
        <>
            <div>
                <h1>Osobní profil</h1>
            </div>
            <div>
                <h1>Rodinný profil</h1>
            </div>
        </>
    );
};
export default Account;
