import { useLocation } from "react-router-dom";
import { FaUserAlt, FaBell } from "react-icons/fa";
import { pageList } from "./page-list";
import { getUser } from "../../api/user-api";
import { useEffect, useState } from "react";
import { User } from "../../types/user";
import { Notification } from "../../types/notification";
import {
    deleteNotifications,
    getAllUserNotifications,
} from "../../api/notification-api";

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedNotification, setSelectedNotification] =
        useState<Notification>({ name: "Nebyla vybrána notifikace", text: "" });
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const location = useLocation();

    const page = pageList.find((page) => page.path === location.pathname);
    const currentTitle = page?.name || "Neznámá stránka";
    const username = user?.username || "Nepřihlášený";

    useEffect(() => {
        const getData = async () => {
            const user = await getUser();
            if (user) {
                setUser(user);
                const userNotifications = await getAllUserNotifications();
                if (userNotifications) {
                    setNotifications(userNotifications);
                }
            }
        };

        getData();

        const handleClickOutside = (event: MouseEvent) => {
            const dropdownElement = document.getElementById(
                "notificationDropdown"
            );
            if (
                dropdownElement &&
                !dropdownElement.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        setShowDropdown(false);
        setSelectedNotification(notification);
        setShowNotificationModal(true);
    };

    const handleCloseNotificationModal = () => {
        setShowNotificationModal(false);
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await deleteNotifications(id);
            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) => notification._id !== id
                )
            );
            handleCloseNotificationModal();
        } catch (error) {
            console.log("Error deleting notification: " + error);
        }
    };

    return (
        <>
            <header className="relative flex items-center justify-between bg-white px-4 py-2 border-b border-gray-300 h-20">
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-semibold text-neutral-700">
                    {currentTitle}
                </h1>

                <div className="flex items-center ml-auto gap-2">
                    <div className="flex gap-1">
                        <FaUserAlt className="text-black" />
                        <span className="text-black font-medium">
                            {username}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <FaBell
                            className="text-black cursor-pointer"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {notifications.length > 0 && (
                            <span className="bg-red-500 text-white rounded-full text-xs px-2">
                                {notifications.length}
                            </span>
                        )}
                    </div>

                    {showDropdown && (
                        <div
                            id="notificationDropdown"
                            className="absolute right-0 top-10 mt-2 bg-white border border-neutral-700 rounded-lg shadow-lg p-2 w-48"
                        >
                            <ul className="space-y-2">
                                {notifications.map((notification, index) => (
                                    <li
                                        key={index}
                                        className="py-2 px-4 bg-red-100 hover:bg-red-200 cursor-pointer rounded"
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                    >
                                        {notification.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {showNotificationModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-red-100 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedNotification.name}
                        </h2>
                        <p className="mb-6">{selectedNotification.text}</p>
                        <div className="flex justify-between">
                            <button
                                onClick={handleCloseNotificationModal}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Zavřít
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() =>
                                    handleDeleteNotification(
                                        selectedNotification._id || "Neznámé ID"
                                    )
                                }
                            >
                                Odstranit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
