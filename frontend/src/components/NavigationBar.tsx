import { Link } from "react-router-dom";
import { pageList } from "./page-list";

const NavigationBar = () => {
    return (
        <div className="navbar">
            {pageList.map((page) => {
                return (
                    <Link to={page.path} className="nav-link">
                        <button>{page.name}</button>
                    </Link>
                );
            })}
        </div>
    );
};

export default NavigationBar;
