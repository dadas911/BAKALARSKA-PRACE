import { loginUser } from "../api/user-api";
import { useState } from "react";
import { UserLogin } from "../types/user-login";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [user, setUser] = useState<UserLogin>({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let response = await loginUser(user);
        if (response.success) {
            sessionStorage.setItem("User", response.data);
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data}`;
            navigate("/home");
        } else {
            alert("Chyba při přihlašování: " + response.data);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder={"E-mail"}
                onChange={handleChange}
                name="email"
                required
                maxLength={20}
            />
            <input
                placeholder={"Password"}
                onChange={handleChange}
                name="password"
                required
                maxLength={20}
                type="password"
            />
            <button type="submit">Přihlásit</button>
        </form>
    );
};

export default Login;
