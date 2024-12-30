import { useState, useEffect } from "react";
import { Scholarship } from "../types/scholarship";
import { getHasPersonalBudget } from "../api/personal-budget-api";
import {
    createScholarship,
    deleteScholarship,
    getAllScholarships,
    updateScholarship,
} from "../api/scholarship-api";
import Loading from "../components/common/Loading";
import Scholarships from "../components/personal/Scholarships";
import ScholarshipForm from "../components/forms/ScholarshipForm";

const ScholarshipsPage = () => {
    //etting up all needed hooks
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);

    const [hasPersonalBudget, setHasPersonalBudget] = useState<boolean>(false);

    const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
    const [updatingScholarship, setUpdatingScholarship] =
        useState<Scholarship | null>(null);

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    //Function for getting scholarship info
    const getScholarshipInfo = async () => {
        const personalBudgetStatus = await getHasPersonalBudget(month, year);
        setHasPersonalBudget(personalBudgetStatus);

        if (personalBudgetStatus) {
            const scholarship = await getAllScholarships();
            if (scholarship) {
                setScholarships(scholarship);
            }
        }
    };

    //Get all scholarship data while displaying loading
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await getScholarshipInfo();
            setLoading(false);
        };

        getData();
    }, []);

    const handleOpenScholarshipModal = (scholarship?: Scholarship) => {
        setUpdatingScholarship(scholarship || null);
        setIsScholarshipModalOpen(true);
    };

    const handleCloseScholarshipModal = () => {
        setUpdatingScholarship(null);
        setIsScholarshipModalOpen(false);
    };

    //Function for add/update scholarship
    const handleAddScholarship = async (newScholarship: Scholarship) => {
        if (updatingScholarship) {
            await updateScholarship(
                newScholarship._id || "No id",
                newScholarship
            );
            setScholarships((prevScholarships) =>
                prevScholarships.map((scholarship) =>
                    scholarship._id === updatingScholarship._id
                        ? newScholarship
                        : scholarship
                )
            );
        } else {
            const rensponseScholarship = await createScholarship(
                newScholarship
            );
            if (rensponseScholarship) {
                setScholarships((prevScholarship) => [
                    ...prevScholarship,
                    rensponseScholarship,
                ]);
            }
        }

        handleCloseScholarshipModal();
    };

    //Function for delete scholarship
    const handleDeleteScholarship = async (id: string) => {
        try {
            await deleteScholarship(id);
            setScholarships((prevScholarship) =>
                prevScholarship.filter((scholarship) => scholarship._id !== id)
            );
        } catch (error) {
            console.log("Error deleting Scholarship: " + error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    //Display all needed components based on hooks and states
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold text-neutral-700 text-center">
                Přehled stipendií
            </h2>
            {hasPersonalBudget ? (
                <>
                    {scholarships.length > 0 ? (
                        <>
                            <Scholarships
                                scholarships={scholarships}
                                onUpdateScholarship={handleOpenScholarshipModal}
                                onDeleteScholarship={handleDeleteScholarship}
                            />
                        </>
                    ) : (
                        <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                            Žádné stipendium
                        </h3>
                    )}
                    <button
                        onClick={() => handleOpenScholarshipModal()}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Přidat stipendium
                    </button>

                    {isScholarshipModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-96 overflow-y-auto max-h-screen">
                                <h3 className="text-xl font-semibold mb-4">
                                    {updatingScholarship
                                        ? "Upravit stipendium"
                                        : "Přidat nové stipendium"}
                                </h3>
                                <ScholarshipForm
                                    onAddScholarship={handleAddScholarship}
                                    initialScholarship={
                                        updatingScholarship || undefined
                                    }
                                />
                                <button
                                    onClick={handleCloseScholarshipModal}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Zavřít
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-red-700 text-center pl-4 py-2">
                        Osobní rozpočet pro tento měsíc není k dispozici
                    </h3>
                </div>
            )}
        </div>
    );
};

export default ScholarshipsPage;
