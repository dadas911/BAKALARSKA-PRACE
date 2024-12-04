import { Link } from "react-router-dom";
import { pageList } from "./page-list";
import { useNavigate, useLocation } from "react-router-dom";
import { FcBarChart } from "react-icons/fc";
import { CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
import { checkUserRole } from "../../api/user-api";
import { getHasFamilyAccount } from "../../api/family-account-api";

const NavigationBar = () => {
    const navigate = useNavigate();
    const currLocation = useLocation();

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

    return (
        <div className="fixed h-full flex flex-col bg-neutral-700 w-60 p-3 invisible sm:visible">
            <div className="flex item-center gap-5 px-3 py-3">
                <FcBarChart fontSize={24} />{" "}
                <span className="text-green-400 text-xl">MoneyS3</span>
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
                            <span className="text-xl">{page.icon}</span>
                            {page.name}
                        </Link>
                    );
                })}
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
