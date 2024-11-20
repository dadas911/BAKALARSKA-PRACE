import { useLocation } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { pageList } from "./page-list"; // Import tvého seznamu stránek
import { getUser } from "../../api/user-api";
import { useEffect, useState } from "react";
import { User } from "../../types/user";

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();

    const page = pageList.find((page) => page.path === location.pathname);
    const currentTitle = page?.name || "Neznámá stránka";
    const username = user?.username || "Nepřihlášený";

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user) {
                setUser(user);
            }
        };

        fetchUser();
    }, [user]);

    return (
        <header className="relative flex items-center justify-between bg-white px-4 py-2 border-b border-gray-300 h-20">
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-semibold text-neutral-700">
                {currentTitle}
            </h1>

            <div className="flex items-center gap-4 px-4 ml-auto">
                <FaUserAlt className="text-black" />
                <span className="text-black font-medium">{username}</span>
            </div>
        </header>
    );
};

export default Header;
