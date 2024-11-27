import { Scholarship } from "../../types/scholarship";

interface ScholarshipsProps {
    scholarships: Scholarship[];
    onUpdateScholarship: (scholarship: Scholarship) => void;
    onDeleteScholarship: (id: string) => void;
}

const containerClass =
    "w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

const itemClass =
    "bg-white p-6 rounded-sm shadow-md border border-gray-200 flex flex-col";

const labelClass = "text-sm text-gray-500 font-light";

const Scholarships: React.FC<ScholarshipsProps> = ({
    scholarships,
    onUpdateScholarship,
    onDeleteScholarship,
}) => (
    <div className="w-full">
        <h3 className="text-2xl font-semibold text-neutral-700 text-center mb-4">
            Shrnutí stipendií
        </h3>
        <div className={containerClass}>
            {scholarships.map((scholarship, index) => (
                <div key={index} className={itemClass}>
                    <div>
                        <div className="text-lg font-semibold text-neutral-700 mb-2 text-center">
                            {scholarship.name}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col space-y-2">
                                <span className={labelClass}>
                                    Očekáváná částka
                                </span>
                                <div className="text-lg font-semibold text-green-700">
                                    {scholarship.amount} Kč
                                </div>
                                <span className={labelClass}>
                                    Datum požádání
                                </span>
                                <div className="text-lg font-semibold text-red-700">
                                    Nevim
                                </div>
                                <span className={labelClass}>
                                    Datum notifikace
                                </span>
                                <div className="text-lg font-semibold text-red-700">
                                    Nevim
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => onUpdateScholarship(scholarship)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Upravit
                        </button>
                        <button
                            onClick={() =>
                                onDeleteScholarship(
                                    scholarship._id ||
                                        "No id for financial goal"
                                )
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Smazat
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Scholarships;
