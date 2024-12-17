import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import DeleteModal from "@/modals/DeleteModal";

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
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleDeactivate = (user: User) => {
        setSelectedUser(user);
        setShowDeactivateModal(true);
    };

    const handleDeactivateConfirm = async () => {
        if (!selectedUser) return;

        try {
            const response = await apiInstance.put(`/users/UnActiveUser/${selectedUser.id}`);

            if (response.status === 200 && response.data.succeeded) {
                toast.success('Vô hiệu hóa tài khoản thành công');
                setTimeout(() => {
                    window.location.href = '/admin/manager-users';
                }, 1000);
            }
        } catch (error) {
        } finally {
            setShowDeactivateModal(false);
            setSelectedUser(null);
        }
    };

    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
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
                        Không tìm thấy người dùng nào
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <Image
                                src={user.avatarUrl}
                                alt={`${user.username}'s avatar`}
                                width={180}
                                height={180}
                                className="rounded-3 border"
                            />
                        </td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                            <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                                {user.isActive ? "Đang hoạt động" : "Đã vô hiệu"}
                            </span>
                        </td>
                        <td>
                            <div className="action-dots float-end">
                                <button
                                    className={`btn ${user.isActive ? 'btn-danger' : 'btn-secondary'}`}
                                    onClick={() => handleDeactivate(user)}
                                    disabled={!user.isActive}
                                >
                                    {user.isActive ? 'Vô hiệu tài khoản' : 'Đã vô hiệu'}
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>

            {/* Deactivate Confirmation Modal */}
            <DeleteModal
                show={showDeactivateModal}
                title="Vô hiệu hóa tài khoản"
                message={`Bạn có chắc chắn muốn vô hiệu hóa tài khoản của người dùng ${selectedUser?.username} không?`}
                onConfirm={handleDeactivateConfirm}
                onCancel={() => {
                    setShowDeactivateModal(false);
                    setSelectedUser(null);
                }}
            />
        </>
    );
};

export default UserTableBody;