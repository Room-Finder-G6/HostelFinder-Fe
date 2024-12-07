import React, { useState, useEffect } from "react";
import styles from "./EditMembershipForm.module.scss";

interface Membership {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;  // Duration should be a number
    membershipServices: {
        id: string;
        serviceName: string;
        maxPushTopAllowed: number;
        maxPostsAllowed: number;
    }[];
}

interface EditMembershipFormProps {
    membership: Membership;
    onSubmit: (id: string, updatedData: Membership) => void;
    onCancel: () => void;
}

const EditMembershipForm: React.FC<EditMembershipFormProps> = ({ membership, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Membership>({
        id: "",
        name: "",
        description: "",
        price: 0,
        duration: 0,  // Initialize as number
        membershipServices: [],
    });

    // Set initial form data when membership data is passed in
    useEffect(() => {
        if (membership) {
            setFormData({
                ...membership,
                membershipServices: membership.membershipServices || [], // Handle services properly
            });
        }
    }, [membership]);

    // Handle input change for simple fields (name, description, price, duration)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle changes in service fields
    const handleServiceChange = (index: number, field: string, value: string | number) => {
        const updatedServices = [...formData.membershipServices];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setFormData((prev) => ({
            ...prev,
            membershipServices: updatedServices,
        }));
    };

    // Add a new service entry
    const handleAddService = () => {
        setFormData((prev) => ({
            ...prev,
            membershipServices: [
                ...prev.membershipServices,
                {
                    id: "", // Default empty id or generate new UUID
                    serviceName: "",
                    maxPushTopAllowed: 0,
                    maxPostsAllowed: 0,
                },
            ],
        }));
    };

    // Remove a service entry
    const handleRemoveService = (index: number) => {
        const updatedServices = formData.membershipServices.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            membershipServices: updatedServices,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData.id, formData); // Pass the updated form data to onSubmit
    };

    return (
        <form onSubmit={handleSubmit} className="edit-membership-form">
            <div style={{ marginBottom: "15px" }}>
                <label htmlFor="name" style={{ display: "block", fontWeight: "bold" }}>
                    Tên Gói Thành Viên:
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Miêu tả:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="price">Giá:</label>
                <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="duration">Khoảng Thời Gian:</label>
                <input
                    id="duration"
                    type="number"  // Changed to number type
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Dịch Vụ:</label>
                {formData.membershipServices && formData.membershipServices.length > 0 ? (
                    formData.membershipServices.map((service, index) => (
                        <div key={index} className="service-group">
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="text"
                                    value={service.serviceName}
                                    onChange={(e) =>
                                        handleServiceChange(index, "serviceName", e.target.value)
                                    }
                                    className="form-control service-input"
                                    placeholder="Tên dịch vụ"
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="number"
                                    value={service.maxPushTopAllowed}
                                    onChange={(e) =>
                                        handleServiceChange(index, "maxPushTopAllowed", Number(e.target.value))
                                    }
                                    className="form-control service-input"
                                    placeholder="Số lần đẩy top"
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="number"
                                    value={service.maxPostsAllowed}
                                    onChange={(e) =>
                                        handleServiceChange(index, "maxPostsAllowed", Number(e.target.value))
                                    }
                                    className="form-control service-input"
                                    placeholder="Số bài viết tối đa"
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveService(index)}
                                style={{ marginBottom: "10px" }}
                            >
                                Xóa Dịch Vụ
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-services">Không có dịch vụ</p>
                )}

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddService}
                    style={{ marginBottom: "25px" }}
                >
                    Thêm Dịch Vụ
                </button>
            </div>

            <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                    Lưu
                </button>
             
            </div>
        </form>
    );
};

export default EditMembershipForm;
