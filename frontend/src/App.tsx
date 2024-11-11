import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PersonalBudget from "./pages/PersonalBudget";
import FamilyBudget from "./pages/FamilyBudget";
import Transactions from "./pages/Transactions";
import User from "./pages/User";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<Layout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/familybudget" element={<FamilyBudget />} />
                    <Route
                        path="/personalbudget"
                        element={<PersonalBudget />}
                    />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/user" element={<User />} />
                </Route>
            </Routes>
        </Router>
    );
}

//Pages
// Landing
// Login
// Home
// FamilyBudget
// PersonalBudget
// Transactions
// User

export default App;
