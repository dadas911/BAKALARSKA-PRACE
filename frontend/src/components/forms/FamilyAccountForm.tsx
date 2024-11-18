import { useState } from "react";
import { createFamilyAccount } from "../../api/family-account-api";
import { FamilyAccount } from "../../types/family-account";

interface FamilyAccountFormProps {
    onCreateAccount: (newAccount: any) => void;
    refresh: () => void;
}

const FamilyAccountForm: React.FC<FamilyAccountFormProps> = ({
    onCreateAccount,
    refresh,
}) => {
    const defaultFamilyAccount = {
        name: "",
    };

    const [newFamilyAccount, setNewFamilyAccount] =
        useState<FamilyAccount>(defaultFamilyAccount);

    const handleFamilyAccountChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewFamilyAccount({
            ...newFamilyAccount,
            [e.target.name]: e.target.value,
        });
    };

    const handleFamilyAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createFamilyAccount(newFamilyAccount);
        if (response) {
            onCreateAccount(response);
            setNewFamilyAccount(defaultFamilyAccount);
            refresh();
        } else {
            alert("Chyba při vytváření rodinného účtu");
        }
    };

    return (
        <form onSubmit={handleFamilyAccountSubmit}>
            <h3>Vytvořit nový rodinný účet</h3>
            Název rozpočtu:
            <input
                type="text"
                name="name"
                value={newFamilyAccount.name}
                onChange={handleFamilyAccountChange}
                required
            />
            <button type="submit">Vytvořit účet</button>
        </form>
    );
};

export default FamilyAccountForm;
