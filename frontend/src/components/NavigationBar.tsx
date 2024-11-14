import { Link } from "react-router-dom";
import { pageList } from "./page-list";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
    const navigate = useNavigate();

    function handleLogout() {
        sessionStorage.removeItem("User");
        navigate("/");
    }

    return (
        <div className="navbar" style={{ backgroundColor: "grey" }}>
            {pageList.map((page) => {
                return (
                    <Link to={page.path} className="nav-link" key={page.name}>
                        <button>{page.name}</button>
                    </Link>
                );
            })}
            <button onClick={handleLogout}>Odhlásit</button>
        </div>
    );
};

export default NavigationBar;
