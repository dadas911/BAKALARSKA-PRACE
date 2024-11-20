import { loginUser } from "../../api/user-api";
import { useState } from "react";
import { UserLogin } from "../../types/user-login";
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                placeholder="E-mail"
                onChange={handleChange}
                name="email"
                required
                maxLength={50}
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            />
            <input
                placeholder="Heslo"
                onChange={handleChange}
                name="password"
                required
                maxLength={50}
                type="password"
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            />
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
                Přihlásit
            </button>
        </form>
    );
};

export default Login;
