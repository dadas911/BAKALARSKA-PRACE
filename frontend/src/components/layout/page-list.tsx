import { FaHome } from "react-icons/fa";
import { IoCashOutline, IoPeopleSharp } from "react-icons/io5";
import { BsCash } from "react-icons/bs";
import { GiStairsGoal } from "react-icons/gi";
import { GrCertificate } from "react-icons/gr";

type Page = {
    key: string;
    name: string;
    path: string;
    icon: JSX.Element; // Ikony jako React komponenty
};

export const pageList: Page[] = [
    {
        key: "home",
        name: "Domů",
        path: "/home",
        icon: <FaHome />,
    },
    {
        key: "familybudget",
        name: "Rodinný rozpočet",
        path: "/familybudget",
        icon: <IoCashOutline />,
    },
    {
        key: "personalbudget",
        name: "Osobní rozpočet",
        path: "/personalbudget",
        icon: <BsCash />,
    },
    {
        key: "user",
        name: "Uživatel a Rodina",
        path: "/user",
        icon: <IoPeopleSharp />,
    },
    {
        key: "financialgoals",
        name: "Finanční cíle",
        path: "/financialgoals",
        icon: <GiStairsGoal />,
    },
    {
        key: "scholarships",
        name: "Stipendia",
        path: "/scholarships",
        icon: <GrCertificate />,
    },
];
