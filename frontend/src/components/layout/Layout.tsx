import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";

const Layout = () => {
    let user = sessionStorage.getItem("User");
    const navigate = useNavigate();

    //If user is not in session storage -> navigate to landing page
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user]);

    //Return structured layout - Navbar + Header + Outlet (pages)
    return (
        <div className="flex flex-row bg-neutral-200 h-screen w-screen overflow-x-hidden">
            <NavigationBar />
            <div className="flex-1 ml-0 sm:ml-60">
                <Header />
                <div className="p-4">{<Outlet />}</div>
            </div>
        </div>
    );
};

export default Layout;
