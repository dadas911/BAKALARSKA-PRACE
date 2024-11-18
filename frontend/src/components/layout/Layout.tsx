import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Layout = () => {
    let user = sessionStorage.getItem("User");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user]);

    return (
        <>
            <NavigationBar />
            <div style={{ paddingTop: "10%" }}>
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
