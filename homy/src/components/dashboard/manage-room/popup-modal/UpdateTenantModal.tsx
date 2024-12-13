// components/tenant/UpdateTenantModal.tsx
import React, { useState, useEffect } from 'react';
import { FaIdCard, FaSave, FaTimes, FaUpload, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiInstance from '@/utils/apiInstance';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

interface TenantData {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
    phone: string;
    description: string | null;
    identityCardNumber: string;
    frontImageUrl: string | null;
    backImageUrl: string | null;
    temporaryResidenceStatus: number;
}

interface ApiResponse {
    succeeded: boolean;
    message: string | null;
    errors: string[] | null;
    data: TenantData;
}

interface UpdateTenantModalProps {
    show: boolean;
    tenantId: string;
    onHide: () => void;
    onSuccess: () => void;
}

const UpdateTenantModal: React.FC<UpdateTenantModalProps> = ({
    show,
    tenantId,
    onHide,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [formData, setFormData] = useState<TenantData>({
        id: '',
        fullName: '',
        avatarUrl: null,
        email: '',
        phone: '',
        description: null,
        identityCardNumber: '',
        frontImageUrl: null,
        backImageUrl: null,
        temporaryResidenceStatus: 0
    });

    const [files, setFiles] = useState({
        avatarImage: null as File | null,
        frontImageImage: null as File | null,
        backImageImage: null as File | null
    });

    useEffect(() => {
        if (show && tenantId) {
            fetchTenantData();
        }
    }, [show, tenantId]);

    const fetchTenantData = async () => {
        setFetchingData(true);
        try {
            const response = await apiInstance.get<ApiResponse>(`/Tenants/${tenantId}`);
            if (response.data.succeeded && response.data.data) {
                const tenant = response.data.data;
                setFormData(tenant);
            } else {
                toast.error('Không thể tải thông tin người thuê');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin');
        } finally {
            setFetchingData(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setFiles(prev => ({
                ...prev,
                [name]: file
            }));

            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [`${name.replace('Image', 'Url')}`]: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append basic form data
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && key !== 'avatarUrl' && key !== 'frontImageUrl' && key !== 'backImageUrl') {
                    formDataToSend.append(key, value.toString());
                }
            });

            // Append files if they exist
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formDataToSend.append(key, file);
                }
            });

            const response = await apiInstance.put('/Tenants', formDataToSend);

            if (response.data.succeeded) {
                toast.success('Cập nhật thông tin thành công');
                onSuccess();
                onHide();
            } else {
                toast.error(response.data.message || 'Cập nhật thất bại');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const renderImagePreview = (url: string | null, alt: string) => {
        if (!url) return null;
        return (
            <div className="image-preview">
                <img src={url} alt={alt} />
            </div>
        );
    };

    if (fetchingData) {
        return (
            <Modal show={show} centered dialogClassName="custom-modal">
                <div className="loading-overlay">
                    <Spinner animation="border" variant="primary" />
                    <p>Đang tải thông tin người thuê...</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            dialogClassName="custom-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title style={{ color: 'black' }}>
                    <FaUser className="me-2" />
                    Cập nhật thông tin người thuê
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="g-4">
                        {/* Personal Information Section */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    <FaUser className="me-2" />
                                    Họ và tên
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    <FaIdCard className="me-2" />
                                    Số CCCD
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="identityCardNumber"
                                    value={formData.identityCardNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="custom-input"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Trạng thái tạm trú</Form.Label>
                                <Form.Select
                                    name="temporaryResidenceStatus"
                                    value={formData.temporaryResidenceStatus}
                                    onChange={handleInputChange}
                                    className="custom-select"
                                >
                                    <option value={0}>Chưa khai báo</option>
                                    <option value={1}>Tạm thời</option>
                                    <option value={2}>Đã khai báo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* Image Upload Section */}
                        <div className="image-section">
                            <Col md={4}>
                                <Form.Group className="upload-group">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    {renderImagePreview(formData.avatarUrl, 'Avatar')}
                                    <div className="custom-file-input">
                                        <FaUpload className="upload-icon" />
                                        <Form.Control
                                            type="file"
                                            name="avatarImage"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="upload-group">
                                    <Form.Label>Ảnh mặt trước CCCD</Form.Label>
                                    {renderImagePreview(formData.frontImageUrl, 'Front ID')}
                                    <div className="custom-file-input">
                                        <FaUpload className="upload-icon" />
                                        <Form.Control
                                            type="file"
                                            name="frontImageImage"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="upload-group">
                                    <Form.Label>Ảnh mặt sau CCCD</Form.Label>
                                    {renderImagePreview(formData.backImageUrl, 'Back ID')}
                                    <div className="custom-file-input">
                                        <FaUpload className="upload-icon" />
                                        <Form.Control
                                            type="file"
                                            name="backImageImage"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </div>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={onHide}
                        disabled={loading}
                        className="btn-cancel"
                    >
                        <FaTimes className="me-2" />
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="btn-submit"
                    >
                        <FaSave className="me-2" />
                        {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                    </Button>
                </Modal.Footer>
            </Form>
            <style jsx>{`
       /* UpdateTenantModal.css */
       /* Styles cho phần upload ảnh */
       .image-upload-section {
           margin-top: 2rem;
           padding: 1rem 0;
       }
       
       .image-upload-container {
           position: relative;
           background: #f8f9fa;
           border-radius: 12px;
           padding: 1.5rem;
           transition: all 0.3s ease;
       }
       
       .image-upload-container:hover {
           background: #fff;
           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
       }
       
       .image-upload-label {
           font-weight: 600;
           color: #344767;
           margin-bottom: 1rem;
           display: block;
       }
       
       .image-preview-container {
           width: 100%;
           height: 200px;
           margin-bottom: 1rem;
           position: relative;
           background: #fff;
           border-radius: 8px;
           overflow: hidden;
           border: 2px dashed #e2e8f0;
       }
       
       .image-preview-container img {
           width: 100%;
           height: 100%;
           object-fit: cover;
           transition: transform 0.3s ease;
       }
       
       .image-preview-container:hover img {
           transform: scale(1.05);
       }
       
       .image-preview-placeholder {
           width: 100%;
           height: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #94a3b8;
       }
       
       .placeholder-icon {
           font-size: 2rem;
           margin-bottom: 0.5rem;
       }
       
       .custom-file-upload {
           position: relative;
           width: 100%;
           margin-top: 1rem;
       }
       
       .file-upload-input {
           width: 100%;
           padding: 0.75rem 1rem 0.75rem 2.5rem;
           border-radius: 8px;
           border: 1px solid #e2e8f0;
           background: #fff;
           transition: all 0.2s ease;
           cursor: pointer;
       }
       
       .file-upload-input:hover {
           border-color: #6610f2;
       }
       
       .file-upload-input:focus {
           border-color: #6610f2;
           box-shadow: 0 0 0 2px rgba(102, 16, 242, 0.1);
           outline: none;
       }
       
       .upload-icon {
           position: absolute;
           left: 1rem;
           top: 50%;
           transform: translateY(-50%);
           color: #6610f2;
           font-size: 1.1rem;
       }
       
       /* Responsive styles */
       @media (max-width: 768px) {
           .image-preview-container {
               height: 150px;
           }
           
           .image-upload-container {
               padding: 1rem;
           }
       }
        `}</style>
        </Modal>
    );
};

export default UpdateTenantModal;