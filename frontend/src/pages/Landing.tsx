import Registration from "../components/auth/Registration";
import Login from "../components/auth/Login";
import { useState } from "react";

const Landing = () => {
    const [displayLogin, setDisplayLogin] = useState<boolean>(true);

    const switchDisplay = () => setDisplayLogin((prev) => !prev);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100">
            <div className="p-8 shadow-md bg-white rounded-lg w-full max-w-md">
                {displayLogin ? (
                    <>
                        <h2 className="text-2xl font-semibold text-neutral-700 mb-6 text-center">
                            Přihlášení
                        </h2>
                        <Login />
                        <button
                            onClick={() => setDisplayLogin(!displayLogin)}
                            className="w-full mt-4 text-sm text-green-500 hover:underline"
                        >
                            Vytvořit nový účet
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-neutral-700 mb-6 text-center">
                            Registrace
                        </h2>
                        <Registration onCreation={switchDisplay} />
                        <button
                            onClick={() => setDisplayLogin(!displayLogin)}
                            className="w-full mt-4 text-sm text-green-500 hover:underline"
                        >
                            Přihlásit se k účtu
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Landing;
