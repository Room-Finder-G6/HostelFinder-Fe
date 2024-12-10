import React from "react";

interface Membership {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
}

interface MembershipTableBodyProps {
    memberships: Membership[];
    loading: boolean;
    onDelete: (id: string) => void;
    onEdit: (membership: Membership) => void; // Thêm prop onEdit
}

const MembershipTableBody: React.FC<MembershipTableBodyProps> = ({ memberships, loading, onDelete, onEdit }) => {
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

    if (!memberships || memberships.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center">
                        No memberships found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
            {memberships.map((membership) => (
                <tr key={membership.id}>
                    <td>{membership.name}</td>
                    <td>{membership.description}</td>
                    <td>${membership.price}</td>
                    <td>{membership.duration}</td>
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
                                    <button
                                        className="dropdown-item"
                                        onClick={() => onEdit(membership)} // Gọi hàm onEdit khi click
                                    >
                                        Edit
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => onDelete(membership.id)} // Gọi hàm xóa khi click
                                    >
                                        Delete
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

export default MembershipTableBody;
