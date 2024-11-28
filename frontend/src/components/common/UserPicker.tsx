import { User } from "../../types/user";

interface UserPickerProps {
    users: User[];
    onUserChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedUserId: string;
}

const UserPicker: React.FC<UserPickerProps> = ({
    users,
    onUserChange,
    selectedUserId,
}) => (
    <div className="w-full bg-white p-4 rounded-sm border border-gray-200 flex flex-col items-center">
        <p className="text-gray-600 text-l font-medium mb-2">
            Vyberte člena rodiny
        </p>
        <div>
            <select
                onChange={onUserChange}
                value={selectedUserId}
                className="p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="DEFAULT">Vyberte uživatele</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.username}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default UserPicker;
