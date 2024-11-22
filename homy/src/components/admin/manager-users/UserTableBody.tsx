import React from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
    id: string;
    username: string;
    email: string;
    phone: string;
    avatarUrl: string;
    isActive: boolean;
}

interface UserTableBodyProps {
    users: User[];
    loading: boolean;
}

const UserTableBody: React.FC<UserTableBodyProps> = ({ users, loading }) => {
    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center">
                        Loading...
                    </td>
                </tr>
            </tbody>
        );
    }

    if (!users || users.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center">
                        No users found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                    <td>
                        <Image
                            src={user.avatarUrl}
                            alt={`${user.username}'s avatar`}
                            width={40}
                            height={40}
                            className="rounded-circle"
                        />
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.isActive ? "Active" : "Inactive"}</td>
                    <td>
                        <div className="action-dots float-end">
                            <button
                                className="action-btn dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <span></span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" href={`/dashboard/edit-user/${user.id}`}>
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => console.log("Deactivate User", user.id)}
                                    >
                                        Deactivate
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default UserTableBody;
