import Registration from "../components/auth/Registration";
import Login from "../components/auth/Login";
import { useState } from "react";

const Landing = () => {
    const [displayLogin, setDisplayLogin] = useState<boolean>(true);

    return (
        <>
            {!displayLogin ? (
                <>
                    <Login />
                    <button
                        onClick={() => {
                            setDisplayLogin(!displayLogin);
                        }}
                    >
                        Vytvořit nový účet
                    </button>
                </>
            ) : (
                <>
                    <Registration />
                    <button
                        onClick={() => {
                            setDisplayLogin(!displayLogin);
                        }}
                    >
                        Přihlásit se k účtu
                    </button>
                </>
            )}
        </>
    );
};

export default Landing;
