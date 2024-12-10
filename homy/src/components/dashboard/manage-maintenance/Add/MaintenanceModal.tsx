import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AddMaintenanceRecord, MaintenanceRecord, MaintenanceType } from '@/models/maintenanceRecord';
import apiInstance from '@/utils/apiInstance';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import RoomSelect from './RoomSelect';

interface MaintenanceModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedHostel: string;
    reloadTable: () => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ show, onClose, onSuccess, selectedHostel, reloadTable }) => {
    const hostelId = selectedHostel;
    const [newRecord, setNewRecord] = useState<AddMaintenanceRecord>({
        hostelId: hostelId,
        roomId: null,
        title: '',
        description: '',
        maintenanceDate: '',
        cost: 0,
        maintenanceType: 0,
    });

    const [loading, setLoading] = useState(false);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('de-DE').format(num);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'cost') {
            const numericValue = value.replace(/\./g, '').replace(/\D/g, '');

            setNewRecord((prevRecord) => ({
                ...prevRecord,
                [name]: numericValue ? Number(numericValue) : 0,

            }));
        }
        else {
            setNewRecord((prevRecord) => ({
                ...prevRecord,
                [name]: name === 'maintenanceType' ? Number(value) : value,
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiInstance.post('/maintenance-record', newRecord);
            if (response.data.succeeded) {
                toast.success('Lịch sử bảo trì đã được thêm thành công!');
                onSuccess();
                onClose();
                reloadTable();
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error adding maintenance record', error);
            toast.error('Lỗi khi thêm lịch sử bảo trì.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setNewRecord((prevRecord) => ({
            ...prevRecord,
            hostelId: selectedHostel,
        }));
    }, [selectedHostel]);


    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới lịch sử bảo trì</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <RoomSelect
                        hostelId={hostelId}
                        onChange={handleInputChange}
                        value={newRecord.roomId}
                    />
                    <FormInput
                        label="Tiêu đề"
                        name="title"
                        value={newRecord.title}
                        type="text"
                        onChange={handleInputChange}
                        required
                    />
                    <FormInput
                        label="Mô tả"
                        name="description"
                        value={newRecord.description}
                        type="text"
                        onChange={handleInputChange}
                    />
                    <FormInput
                        label="Ngày bảo trì/ sửa chữa"
                        name="maintenanceDate"
                        value={newRecord.maintenanceDate}
                        type="date"
                        onChange={handleInputChange}
                        required
                    />
                    <FormInput
                        label="Số tiền"
                        name="cost"
                        value={formatNumber(newRecord.cost)}
                        type="text"
                        onChange={handleInputChange}
                        required
                    />
                    <FormSelect
                        label="Loại"
                        name="maintenanceType"
                        value={newRecord.maintenanceType}
                        options={[
                            { label: 'Sửa điện', value: MaintenanceType.Electrical },
                            { label: 'Sửa ống nước', value: MaintenanceType.Plumbing },
                            { label: 'Sửa tường', value: MaintenanceType.Painting },
                            { label: 'Sửa chữa chung', value: MaintenanceType.General },
                            { label: 'Khác', value: MaintenanceType.Other },
                        ]}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading} className="ms-2">
                            {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MaintenanceModal;
