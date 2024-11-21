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
        <form
            onSubmit={handleFamilyAccountSubmit}
            className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg"
        >
            <h3 className="text-xl font-semibold mb-6 text-center">
                Vytvořit nový rodinný účet
            </h3>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                >
                    Název rozpočtu:
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={newFamilyAccount.name}
                    onChange={handleFamilyAccountChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Zadejte název rodinného účtu"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition"
            >
                Vytvořit účet
            </button>
        </form>
    );
};

export default FamilyAccountForm;
