import React, {useEffect, useState} from 'react';
import {Modal, Button, Spinner, Form} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {MaintenanceRecord, MaintenanceType} from '@/models/maintenanceRecord';
import apiInstance from '@/utils/apiInstance';
import FormInput from "./FormInput";
import RoomSelect from "./RoomSelect";
import FormSelect from "./FormSelect";
import Loading from "@/components/Loading";

interface EditMaintenanceModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedHostel: string;
    reloadTable: () => void;
    recordId: string | null;
}

const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({
                                                                       show,
                                                                       onClose,
                                                                       onSuccess,
                                                                       selectedHostel,
                                                                       reloadTable,
                                                                       recordId
                                                                   }) => {
    const [record, setRecord] = useState<MaintenanceRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('de-DE').format(num);
    };

    // Fetch maintenance record details
    useEffect(() => {
        const fetchMaintenanceRecord = async () => {
            if (!recordId || !show) return;

            setFetchLoading(true);
            try {
                const response = await apiInstance.get(`/maintenance-record/${recordId}`);
                if (response.data.succeeded) {
                    setRecord(response.data.data);
                    console.log(response.data.data);
                } else {
                    toast.error('Không thể lấy thông tin bảo trì');
                }
            } catch (error) {
                console.error('Error fetching maintenance record:', error);
                toast.error('Lỗi khi lấy thông tin bảo trì');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchMaintenanceRecord();
    }, [recordId, show]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!record) return;

        const {name, value} = e.target;
        if (name === 'cost') {
            const numericValue = value.replace(/\./g, '').replace(/\D/g, '');
            setRecord({
                ...record,
                [name]: numericValue ? Number(numericValue) : 0,
            });
        } else {
            setRecord({
                ...record,
                [name]: name === 'maintenanceType' ? Number(value) : value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!record || !recordId) return;

        setLoading(true);
        try {
            const response = await apiInstance.put(`/maintenance-record/${recordId}`, record);
            if (response.data.succeeded) {
                toast.success('Cập nhật thông tin bảo trì thành công!');
                onSuccess();
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật.');
            }
        } catch (error) {
            console.error('Error updating maintenance record:', error);
            toast.error('Lỗi khi cập nhật thông tin bảo trì.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <Modal show={show} onHide={onClose}>
                <Modal.Body className="text-center">
                    <Loading/>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa lịch sử bảo trì</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {record && (
                    <Form onSubmit={handleSubmit}>
                        <RoomSelect
                            hostelId={selectedHostel}
                            onChange={handleInputChange}
                            value={record.roomId}
                        />
                        <FormInput
                            label="Tiêu đề"
                            name="title"
                            value={record.title}
                            type="text"
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            label="Mô tả"
                            name="description"
                            value={record.description}
                            type="text"
                            onChange={handleInputChange}
                        />
                        <FormInput
                            label="Ngày bảo trì/ sửa chữa"
                            name="maintenanceDate"
                            value={record.maintenanceDate.split('T')[0]}
                            type="date"
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            label="Số tiền"
                            name="cost"
                            value={formatNumber(record.cost)}
                            type="text"
                            onChange={handleInputChange}
                            required
                        />
                        <FormSelect
                            label="Loại"
                            name="maintenanceType"
                            value={record.maintenanceType}
                            options={[
                                {label: 'Sửa điện', value: MaintenanceType.Electrical},
                                {label: 'Sửa ống nước', value: MaintenanceType.Plumbing},
                                {label: 'Sửa tường', value: MaintenanceType.Painting},
                                {label: 'Sửa chữa chung', value: MaintenanceType.General},
                                {label: 'Khác', value: MaintenanceType.Other},
                            ]}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading} className="ms-2">
                                {loading ? <Spinner animation="border" size="sm"/> : 'Lưu'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditMaintenanceModal;