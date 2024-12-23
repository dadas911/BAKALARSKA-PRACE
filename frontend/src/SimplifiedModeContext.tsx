import { createContext, useState, useContext, useEffect } from "react";
import { getUser, updateUserSimplifiedMode } from "./api/user-api";
import { User } from "./types/user";
import Loading from "./components/common/Loading";

interface SimplifiedUIModeContextType {
    isSimplifiedUIMode: boolean;
    toggleSimplifiedUIMode: () => void;
    isUserLogged: boolean;
    setIsUserLogged: (loggedIn: boolean) => void;
}

const SimplifiedUIModeContext = createContext<SimplifiedUIModeContextType>({
    isSimplifiedUIMode: false,
    toggleSimplifiedUIMode: () => {},
    isUserLogged: false,
    setIsUserLogged: () => {},
});

export const SimplifiedUIModeProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [isSimplifiedUIMode, setIsSimplifiedUIMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isUserLogged, setIsUserLogged] = useState<boolean>(false);

    const toggleSimplifiedUIMode = () => {
        const currSimplifiedMode = isSimplifiedUIMode;
        setIsSimplifiedUIMode(!currSimplifiedMode);
        updateSimplifiedMode(!currSimplifiedMode);
        updateUserSimplifiedMode(user?._id || "no id", !currSimplifiedMode);
    };

    const updateSimplifiedMode = (simplifiedMode: boolean) => {
        if (simplifiedMode) {
            document.body.classList.add("simplified-UI-mode");
        } else {
            document.body.classList.remove("simplified-UI-mode");
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (isUserLogged) {
                const user = await getUser();
                if (user) {
                    setUser(user);
                    const simplifiedMode = user.simplifiedMode || false;
                    setIsSimplifiedUIMode(simplifiedMode);
                    updateSimplifiedMode(simplifiedMode);
                }
            }
            setLoading(false);
        };

        getData();
    }, [isUserLogged]);

    if (loading) {
        return <Loading />;
    }

    return (
        <SimplifiedUIModeContext.Provider
            value={{
                isSimplifiedUIMode,
                toggleSimplifiedUIMode,
                isUserLogged,
                setIsUserLogged,
            }}
        >
            {children}
        </SimplifiedUIModeContext.Provider>
    );
};

export const useSimplifiedUIMode = () => useContext(SimplifiedUIModeContext);
