import { useState } from "react";
import { Scholarship } from "../../types/scholarship";

interface ScholarshipFormProps {
    onAddScholarship: (scholarship: Scholarship) => void;
    initialScholarship?: Scholarship;
}

const ScholarshipForm: React.FC<ScholarshipFormProps> = ({
    onAddScholarship,
    initialScholarship,
}) => {
    const defaultScholarship = {
        name: "",
        amount: 0,
        submissionDate: new Date(),
    };

    const [scholarship, setScholarship] = useState<Scholarship>(
        initialScholarship || defaultScholarship
    );

    const handleScholarshipChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setScholarship({
            ...scholarship,
            [e.target.name]: e.target.value,
        });
    };

    const handleScholarshipSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddScholarship(scholarship);
    };

    return (
        <form onSubmit={handleScholarshipSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Jméno stipendia
                </label>
                <input
                    type="text"
                    name="name"
                    value={scholarship.name}
                    onChange={handleScholarshipChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    maxLength={50}
                    placeholder="Zadejte název cíle"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Očekávaná částka
                </label>
                <input
                    type="number"
                    name="amount"
                    value={scholarship.amount}
                    onChange={handleScholarshipChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="Částka, kterou chcete dosáhnout"
                    min="0"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Zažádat do data
                </label>
                <input
                    type="date"
                    name="submissionDate"
                    value={
                        new Date(scholarship.submissionDate)
                            .toISOString()
                            .split("T")[0]
                    }
                    onChange={handleScholarshipChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Upozornit v den
                </label>
                <input
                    type="date"
                    name="notifyDate"
                    value={
                        scholarship.notifyDate
                            ? new Date(scholarship.notifyDate)
                                  .toISOString()
                                  .split("T")[0]
                            : ""
                    }
                    onChange={handleScholarshipChange}
                    className="w-full px-3 py-2 border rounded"
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                {initialScholarship
                    ? "Upravit stipendium"
                    : "Přidat stipendium"}
            </button>
        </form>
    );
};

export default ScholarshipForm;
