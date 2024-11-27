import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PersonalBudget from "./pages/PersonalBudget";
import FamilyBudget from "./pages/FamilyBudget";
import User from "./pages/User";
import FinancialGoals from "./pages/FinancialGoals";
import Scholarships from "./pages/Scholarships";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { useLayoutEffect } from "react";
import axios from "axios";

function App() {
    useLayoutEffect(() => {
        async function setToken() {
            const token = sessionStorage.getItem("User");
            if (token) {
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
            }
        }

        setToken();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/familybudget" element={<FamilyBudget />} />
                    <Route
                        path="/personalbudget"
                        element={<PersonalBudget />}
                    />
                    <Route path="/user" element={<User />} />
                    <Route
                        path="/financialgoals"
                        element={<FinancialGoals />}
                    />
                    <Route path="/scholarships" element={<Scholarships />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
