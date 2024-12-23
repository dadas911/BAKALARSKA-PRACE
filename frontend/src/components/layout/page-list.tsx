import { FaHome } from "react-icons/fa";
import { IoCashOutline, IoPeopleSharp } from "react-icons/io5";
import { BsCash } from "react-icons/bs";
import { GiStairsGoal } from "react-icons/gi";
import { GrCertificate } from "react-icons/gr";
import { FaUserCheck } from "react-icons/fa6";
import { GiArchiveResearch } from "react-icons/gi";

type Page = {
    key: string;
    name: string;
    path: string;
    icon: JSX.Element;
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
        key: "familymemberbudget",
        name: "Rozpočet člena rodiny",
        path: "/familymemberbudget",
        icon: <FaUserCheck />,
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
    {
        key: "user",
        name: "Uživatel a Rodina",
        path: "/user",
        icon: <IoPeopleSharp />,
    },
    {
        key: "analysis",
        name: "Analýza finanční situace",
        path: "/analysis",
        icon: <GiArchiveResearch />,
    },
];
