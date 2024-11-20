import { FaHome } from "react-icons/fa";
import { IoCashOutline, IoPeopleSharp } from "react-icons/io5";
import { BsCash } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";

type Page = {
    key: string;
    name: string;
    path: string;
    icon: JSX.Element; // Ikony jako React komponenty
};

export const pageList: Page[] = [
    {
        key: "home",
        name: "Home",
        path: "/home",
        icon: <FaHome />,
    },
    {
        key: "familybudget",
        name: "Family Budget",
        path: "/familybudget",
        icon: <IoCashOutline />,
    },
    {
        key: "personalbudget",
        name: "Personal Budget",
        path: "/personalbudget",
        icon: <BsCash />,
    },
    {
        key: "user",
        name: "User",
        path: "/user",
        icon: <IoPeopleSharp />,
    },
    {
        key: "dashboard",
        name: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
    },
];
