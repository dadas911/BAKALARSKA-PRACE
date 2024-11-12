import { createUser } from "../api/user-api";
import { useState } from "react";
import { User } from "../types/user";

const Registration = () => {
    const [user, setUser] = useState<User>({
        username: "",
        firstName: "",
        secondName: "",
        password: "",
        email: "",
        role: "živitel",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let response = await createUser(user);
        if (response.success) {
            alert("Uživatel byl úspěšně vytvořen");
        } else {
            alert("Chyba při vytváření uživatele: " + response.data);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder={"Username"}
                onChange={handleChange}
                name="username"
                required
                maxLength={20}
            />
            <input
                placeholder={"First name"}
                onChange={handleChange}
                name="firstName"
                required
                maxLength={20}
            />
            <input
                placeholder={"Second name"}
                onChange={handleChange}
                name="secondName"
                required
                maxLength={20}
            />
            <input
                placeholder={"E-mail"}
                onChange={handleChange}
                name="email"
                required
                maxLength={20}
            />
            Role:
            <select name="role">
                <option value="živitel">Živitel</option>
                <option value="člen domácnosti">Člen domácnosti</option>
                <option value="student">Student</option>
                <option value="senior">Senior</option>
            </select>
            <input
                placeholder={"Password"}
                onChange={handleChange}
                name="password"
                required
                maxLength={20}
                type="password"
            />
            <button type="submit">Vytvořit účet</button>
        </form>
    );
};

export default Registration;
