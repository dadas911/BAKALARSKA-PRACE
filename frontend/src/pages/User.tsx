import { useEffect, useState } from "react";
import { getUserById } from "../api/user-api";
import { getFamilyAccountById } from "../api/family-account-api";
import { User } from "../types/user";
import { FamilyAccount } from "../types/family-account";

const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [familyAccount, setFamilyAccount] = useState<FamilyAccount | null>(
        null
    );

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
