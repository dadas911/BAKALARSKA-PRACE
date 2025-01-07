import { Link } from "react-router-dom";
import { pageList } from "./page-list";
import { useNavigate, useLocation } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
import { checkUserRole } from "../../api/user-api";
import { getHasFamilyAccount } from "../../api/family-account-api";
import { useSimplifiedUIMode } from "../../SimplifiedModeContext";
import { GiNestBirds } from "react-icons/gi";

const NavigationBar = () => {
    const navigate = useNavigate();
    const currLocation = useLocation();
    const { isSimplifiedUIMode, toggleSimplifiedUIMode } =
        useSimplifiedUIMode();

    const [isStudent, setIsStudent] = useState<boolean>(false);
    const [isProvider, setIsProvider] = useState<boolean>(false);
    const [hasFamilyAccount, setHasFamilyAccount] = useState<boolean>(false);

    useEffect(() => {
        const checkRoles = async () => {
            const student = await checkUserRole("student");
            setIsStudent(student);
            const provider = await checkUserRole("živitel");
            setIsProvider(provider);
            const hasAccount = await getHasFamilyAccount();
            console.log("hasAccount");
            setHasFamilyAccount(hasAccount);
        };

        checkRoles();
    }, [isStudent, isProvider]);

    function handleLogout() {
        sessionStorage.removeItem("User");
        navigate("/");
    }

    const classLink =
        "flex item-center gap-2 font-light px-3 py-2 hover:bg-green-600 hover:no-underline active:bg-green-600 rounded-sm text-base";
    const classLinkActive = "bg-green-600 text-white";

    //Display all pages based on page-list
    return (
        <div className="fixed h-full flex flex-col bg-neutral-700 w-60 p-3 invisible sm:visible overflow-y-auto">
            <div className="flex item-center gap-5 px-3 py-3">
                <GiNestBirds
                    className="text-green-500 navbar-icon"
                    fontSize={30}
                />{" "}
                <span className="text-green-400 text-xl navbar-title">
                    BudgetNest
                </span>
            </div>
            <div className="flex-1 gap-0.5 py-8 flex-col flex">
                {pageList.map((page) => {
                    if (
                        (page.key === "familymemberbudget" && !isProvider) ||
                        (page.key === "familymemberbudget" &&
                            !hasFamilyAccount) ||
                        (page.key === "scholarships" && !isStudent)
                    ) {
                        return null;
                    }

                    const isActiveLink = currLocation.pathname === page.path;
                    return (
                        <Link
                            to={page.path}
                            key={page.key}
                            className={`${classLink} ${
                                isActiveLink ? classLinkActive : ""
                            }`}
                        >
                            <span className="text-xl navbar-icon">
                                {page.icon}
                            </span>
                            {page.name}
                        </Link>
                    );
                })}
            </div>
            <div className="flex items-center gap-3 px-3 mb-4">
                <span className="text-white">Zjednodušený režim</span>
                <label className="relative inline-block w-12 h-6">
                    <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        checked={isSimplifiedUIMode}
                        onChange={toggleSimplifiedUIMode}
                    />
                    <span className="slider round absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-400 transition duration-200 rounded-full">
                        <span
                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                isSimplifiedUIMode
                                    ? "transform translate-x-6"
                                    : ""
                            }`}
                        />
                    </span>
                </label>
            </div>
            <div className="flex flex-col border-t border-green-600 pt-2 gap-0.5">
                <button
                    onClick={handleLogout}
                    className="flex text-red-600 items-center gap-4 px-3 py-2 rounded-sm hover:bg-red-600 hover:text-white"
                >
                    <CiLogout fontSize={24} />
                    <span>Odhlásit</span>
                </button>
            </div>
        </div>
    );
};

export default NavigationBar;
