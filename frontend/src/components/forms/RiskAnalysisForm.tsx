import { useState } from "react";

interface RiskAnalysisFormProps {
    isPersonal: boolean;
    onAnalyzeRisk: (reserve: number) => void;
}

const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({
    isPersonal,
    onAnalyzeRisk,
}) => {
    const [enteredReserve, setEnteredReserve] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyzeRisk(enteredReserve);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        {isPersonal ? "Osobní" : "Rodinná"} finanční rezerva
                        (Kč)
                    </label>
                    <input
                        type="number"
                        value={enteredReserve}
                        onChange={(e) => {
                            setEnteredReserve(Number(e.target.value));
                        }}
                        className="w-full px-3 py-2 border rounded"
                        required
                        min="0"
                        placeholder="Finanční rezerva"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    Analyzovat
                </button>
            </form>
        </div>
    );
};

export default RiskAnalysisForm;
