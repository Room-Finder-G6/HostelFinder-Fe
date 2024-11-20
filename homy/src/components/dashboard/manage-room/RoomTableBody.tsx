// components/RoomTableBody.tsx
import React, { useEffect, useState, Fragment } from 'react';
import apiInstance from '@/utils/apiInstance';
import { Room } from './Room';
import Loading from "@/components/Loading";
import { FaEdit, FaTrash, FaFileContract, FaFileInvoice, FaEllipsisV } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import CreateContractModal from './CreateContractModal'; // Import modal
import './rentralContract.css';
interface RoomTableBodyProps {
    selectedHostel: string;
    selectedFloor: string | null;
    refresh: number;
}

const RoomTableBody: React.FC<RoomTableBodyProps> = ({ selectedHostel, selectedFloor, refresh }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');

    useEffect(() => {
        if (!selectedHostel) return;

        const fetchRooms = async () => {
            setLoading(true);
            try {
                let url = `/rooms/hostels/${selectedHostel}`;
                if (selectedFloor) {
                    url += `?floor=${selectedFloor}`;
                }
                const response = await apiInstance.get(url);
                if (response.data.succeeded) {
                    setRooms(response.data.data);
                } else {
                    setError('Không thể tải danh sách phòng');
                }
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi tải danh sách phòng');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [selectedHostel, selectedFloor, refresh]);

    useEffect(() => {
        console.log("isModalOpen state:", isModalOpen);
    }, [isModalOpen]);

    const handleEdit = (roomId: string) => {
        // Logic to edit the room
    };

    const handleDelete = (roomId: string) => {
        // Logic to delete the room
    };

    const handleCreateContract = (roomId: string) => {
        console.log("Opening modal for room:", roomId);
        setSelectedRoomId(roomId);
        setIsModalOpen(true);
    };

    const handleCreateInvoice = (roomId: string) => {
        // Logic to create an invoice for the room
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRoomId('');
    };

    const handleSuccessCreateContract = () => {
        // Tăng giá trị refresh để kích hoạt useEffect và làm mới danh sách phòng
        // Nếu `refresh` được quản lý từ component cha, hãy gọi hàm tăng `refresh`
        // Ở đây, giả sử bạn có một hàm prop để làm điều đó
        // Nếu không, bạn có thể quản lý `refresh` trong state tại đây hoặc gọi lại fetchRooms()
        // Ví dụ:
        // setRefresh(prev => prev + 1);
        setIsModalOpen(false);
        setSelectedRoomId('');
        // Để làm mới danh sách phòng ngay lập tức, bạn có thể gọi lại fetchRooms() nếu cần
    };

    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>
                        <Loading />
                    </td>
                </tr>
            </tbody>
        );
    }

    if (error) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>Lỗi: {error}</td>
                </tr>
            </tbody>
        );
    }

    if (rooms.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>Không có phòng nào trong nhà trọ này.</td>
                </tr>
            </tbody>
        );
    }

    return (
        <>
            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id} className="border-b">
                        <td className="py-4 px-6">
                            <div className="flex items-center">
                                <img
                                    src={room.imageRoom}
                                    alt={room.roomName}
                                    className="rounded w-20 h-20 object-cover mr-4"
                                />
                                <div>
                                    <h6 className="font-semibold text-lg">{room.roomName}</h6>
                                    <p className="text-sm text-gray-600">Tầng: {room.floor ?? 'N/A'}</p>
                                    <p className="text-sm text-gray-600">Diện tích: {room.size} m²</p>
                                    <p className="text-sm text-gray-600">Số người tối đa: {room.maxRenters}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-6">{new Date(room.createdOn).toLocaleDateString()}</td>
                        <td className="py-4 px-6">{new Intl.NumberFormat('vi-VN').format(room.monthlyRentCost)} đ</td>
                        <td className="py-4 px-6">
                            {room.isAvailable ? (
                                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                                    Còn trống
                                </span>
                            ) : (
                                <span className="inline-block px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
                                    Đã thuê
                                </span>
                            )}
                        </td>
                        <td className="py-4 px-6 text-right">
                            {/* Dropdown Menu */}
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="inline-flex justify-center w-full text-gray-700">
                                        <FaEllipsisV />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleEdit(room.id)}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                            } group flex items-center px-4 py-2 text-sm w-full`}
                                                    >
                                                        <FaEdit className="mr-3" />
                                                        Chỉnh sửa
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleDelete(room.id)}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                            } group flex items-center px-4 py-2 text-sm w-full`}
                                                    >
                                                        <FaTrash className="mr-3" />
                                                        Xóa
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleCreateContract(room.id)}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                            } group flex items-center px-4 py-2 text-sm w-full`}
                                                    >
                                                        <FaFileContract className="mr-3" />
                                                        Tạo hợp đồng
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleCreateInvoice(room.id)}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                            } group flex items-center px-4 py-2 text-sm w-full`}
                                                    >
                                                        <FaFileInvoice className="mr-3" />
                                                        Tạo hóa đơn
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </td>
                    </tr>
                ))}
            </tbody>
            {/* Modal Tạo Hợp Đồng */}
            <CreateContractModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                roomId={selectedRoomId}
                hostelId={selectedHostel}
                onSuccess={handleSuccessCreateContract}
            />
        </>
    );
};

export default RoomTableBody;
