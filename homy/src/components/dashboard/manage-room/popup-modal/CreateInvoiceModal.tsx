import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, roomId }) => {
    const [billingMonth, setBillingMonth] = useState<number>(new Date().getMonth() + 1);
    const [billingYear, setBillingYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                roomId: roomId,
                billingMonth: billingMonth,
                billingYear: billingYear,
            };

            const response = await apiInstance.post('/invoices/monthly-invoice', data);
            if (response.status === 200 && response.data.succeeded) {
                toast.success(response.data.message || 'Invoice created successfully');
                onClose();
            } else if (response.status === 400 && response.data.succeeded) {
                toast.error(response.data.message);
            }
            else {
                toast.error(response.data.message || 'Failed to create invoice');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark fw-bold">Tạo hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="billingMonth">
                        <Form.Label>Tháng</Form.Label>
                        <Form.Control
                            as="select"
                            value={billingMonth}
                            onChange={(e) => setBillingMonth(parseInt(e.target.value))}
                            required
                        >
                            {[...Array(12)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="billingYear">
                        <Form.Label>Năm</Form.Label>
                        <Form.Control
                            type="number"
                            value={billingYear}
                            onChange={(e) => setBillingYear(parseInt(e.target.value))}
                            required
                            min="2000"
                            max="2100"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Đang tạo...' : 'Tạo hóa đơn'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateInvoiceModal;
