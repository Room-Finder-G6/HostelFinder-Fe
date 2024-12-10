import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import apiInstance from '@/utils/apiInstance';
import { Amenity } from '@/models/amenity';
import { UpdateRoomRequestDto } from '@/models/UpdateRoomRequestDto';
import { toast } from "react-toastify";
import './css/EditRoom.css';
import Loading from '@/components/Loading';
interface EditRoomModalProps {
    roomId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedRoom: any) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ roomId, isOpen, onClose, onSuccess }) => {
    const [room, setRoom] = useState<UpdateRoomRequestDto | null>(null);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [roomImages, setRoomImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch room and amenities data when roomId changes
    useEffect(() => {
        if (!roomId) return;

        const fetchRoomDetails = async () => {
            setLoading(true);
            try {
                // Fetch room data with amenities and images
                const roomResponse = await apiInstance.get(`/rooms/get-room-with-amentities-and-image?roomId=${roomId}`);
                if (roomResponse.data.succeeded) {
                    const roomData = roomResponse.data.data;
                    setRoom(roomData);
                    setSelectedAmenities(roomData.amenityIds || []);
                    setRoomImages(roomData.imageRoom || []);
                } else {
                    setError('Không thể tải thông tin phòng');
                }

                // Fetch amenities data
                const amenitiesResponse = await apiInstance.get(`/amenities`);
                if (amenitiesResponse.data.succeeded) {
                    setAmenities(amenitiesResponse.data.data);
                } else {
                    setError('Không thể tải tiện ích');
                }
            } catch (err: any) {
                console.log(err.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [roomId]);

    const handleSave = async () => {
        if (!room || !selectedAmenities || selectedAmenities.length === 0) {
            setError('Vui lòng nhập đầy đủ thông tin phòng và tiện ích.');
            return;
        }

        const formData = new FormData();

        // Append các trường thông tin khác
        formData.append('RoomName', room.roomName); // roomName
        formData.append('Size', room.size.toString()); // size
        formData.append('MaxRenters', room.maxRenters.toString()); // maxRenters
        formData.append('HostelId', room.hostelId); // hostelId
        formData.append('Floor', room.floor?.toString() || ''); // floor
        formData.append('MonthlyRentCost', room.monthlyRentCost.toString()); // monthlyRentCost
        formData.append('Deposit', room.deposit.toString()); // deposit
        formData.append('RoomType', room.roomType.toString()); // roomType
        formData.append('IsAvailable', room.isAvailable.toString()); // isAvailable

        // Append các tiện ích (amenityIds)
        selectedAmenities.forEach((amenityId) => {
            formData.append('AmenityId', amenityId); // Lặp qua các tiện ích
        });

        // Append ảnh phòng
        roomImages.forEach((image) => {
            formData.append('roomImages', image); // Thêm từng ảnh vào formData
        });

        try {
            setLoading(true);
            const updateResponse = await apiInstance.put(`/rooms/${roomId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (updateResponse.data.succeeded) {
                toast.success("Chỉnh sửa phòng trọ thành công");
                onSuccess(room);
                onClose();
            } else {
                setError('Không thể cập nhật phòng');
            }
        } catch (err: any) {
            toast.warning(err.response.data.message);
        }
        finally {
            return setLoading(false);
        }
    };

    const handleAmenitySelect = (amenityId: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityId) ? prev.filter(id => id !== amenityId) : [...prev, amenityId]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setRoomImages([...roomImages, ...Array.from(e.target.files)]);
        }
    };

    // Handle availability toggle
    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (room) {
            setRoom({ ...room, isAvailable: e.target.checked });
        }
    };

    if (loading) return <Loading />
    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title style={{ color: 'black' }}>Chỉnh sửa phòng {room?.roomName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {room && (
                    <Form>
                        <Form.Group controlId="roomName">
                            <Form.Label>Tên phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={room.roomName}
                                onChange={(e) => setRoom({ ...room, roomName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="floor">
                            <Form.Label>Tầng</Form.Label>
                            <Form.Control
                                type="number"
                                value={room.floor || ''}
                                onChange={(e) => setRoom({ ...room, floor: e.target.value ? parseInt(e.target.value, 10) : null })}
                            />
                        </Form.Group>
                        <Form.Group controlId="maxRenters">
                            <Form.Label>Số người tối đa</Form.Label>
                            <Form.Control
                                type="number"
                                value={room.maxRenters}
                                onChange={(e) => setRoom({ ...room, maxRenters: parseInt(e.target.value, 10) })}
                            />
                        </Form.Group>
                        <Form.Group controlId="monthlyRentCost">
                            <Form.Label>Giá thuê hàng tháng</Form.Label>
                            <Form.Control
                                type="number"
                                value={room.monthlyRentCost}
                                onChange={(e) => setRoom({ ...room, monthlyRentCost: parseInt(e.target.value, 10) })}
                            />
                        </Form.Group>
                        <Form.Group controlId="deposit">
                            <Form.Label>Số tiền đặt cọc</Form.Label>
                            <Form.Control
                                type="number"
                                value={room.deposit}
                                onChange={(e) => setRoom({ ...room, deposit: parseInt(e.target.value, 10) })}
                            />
                        </Form.Group>
                        <Form.Group controlId="size">
                            <Form.Label>Diện tích</Form.Label>
                            <Form.Control
                                type="number"
                                value={room.size}
                                onChange={(e) => setRoom({ ...room, size: parseInt(e.target.value, 10) })}
                            />
                        </Form.Group>
                        <Form.Group controlId="roomType">
                            <Form.Label>Loại phòng</Form.Label>
                            <Form.Control
                                as="select"
                                value={room?.roomType}
                                onChange={(e) => setRoom({ ...room, roomType: parseInt(e.target.value, 10) })}
                            >
                                <option value={1}>Phòng trọ</option>
                                <option value={2}>Chung cư</option>
                                <option value={3}>Chung cư mini</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isAvailable">
                            <Form.Label>Trạng thái phòng</Form.Label>
                            <div className="custom-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={room.isAvailable}
                                        onChange={handleAvailabilityChange}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span className="status-label">{room.isAvailable ? 'Đang trống' : 'Đã có người thuê'}</span>
                            </div>
                        </Form.Group>



                        <Form.Group controlId="amenities">
                            <Form.Label>Tiện ích</Form.Label>
                            <Row>
                                {amenities.map((amenity: any) => (
                                    <Col key={amenity.id} sm={3}>
                                        <Form.Check
                                            type="checkbox"
                                            label={amenity.amenityName}
                                            checked={selectedAmenities.includes(amenity.id)}
                                            onChange={() => handleAmenitySelect(amenity.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="roomImages">
                            <Form.Label>Ảnh phòng</Form.Label>
                            <input type="file" multiple onChange={handleImageChange} />
                            <div className="mt-2">
                                {roomImages.length > 0 && (
                                    <div>
                                        <strong>Ảnh hiện tại:</strong>
                                        <div className="mt-2">
                                            {roomImages.map((image, index) => {
                                                if (image instanceof File) {
                                                    return (
                                                        <img
                                                            key={index}
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Room Image ${index + 1}`}
                                                            style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                                        />
                                                    );
                                                } else {
                                                    return (
                                                        <img
                                                            key={index}
                                                            src={image}  // Assuming `image` contains URL from the API
                                                            alt={`Room Image ${index + 1}`}
                                                            style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                                        />
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditRoomModal;
