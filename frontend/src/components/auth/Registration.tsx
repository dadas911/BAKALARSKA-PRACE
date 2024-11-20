import { createUser } from "../../api/user-api";
import { useState } from "react";
import { User } from "../../types/user";

interface RegistrationProps {
    onCreation: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onCreation }) => {
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
            onCreation();
        } else {
            alert("Chyba při vytváření uživatele: " + response.data);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                placeholder="Uživatelské jméno"
                onChange={handleChange}
                name="username"
                required
                maxLength={50}
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            />
            <input
                placeholder="Jméno"
                onChange={handleChange}
                name="firstName"
                required
                maxLength={50}
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            />
            <input
                placeholder="Příjmení"
                onChange={handleChange}
                name="secondName"
                required
                maxLength={50}
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            />
            <input
                placeholder="E-mail"
                onChange={handleChange}
                name="email"
                required
                maxLength={50}
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            />
            <select
                name="role"
                className="border border-gray-300 p-3 rounded focus:outline-green-500"
            >
                <option value="živitel">Živitel</option>
                <option value="člen domácnosti">Člen domácnosti</option>
                <option value="student">Student</option>
                <option value="senior">Senior</option>
            </select>
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
                Vytvořit účet
            </button>
        </form>
    );
};

export default Registration;
