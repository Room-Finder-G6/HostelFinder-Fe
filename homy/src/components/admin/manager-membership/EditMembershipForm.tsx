import React, { useState, useEffect } from "react";
import styles from "./EditMembershipForm.module.scss";


interface Membership {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    membershipsServices: {
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
        duration: "",
        membershipsServices: [],
    });

    useEffect(() => {
        if (membership) {
            setFormData({
                ...membership,
                membershipsServices: membership.membershipsServices || [],
            });
        }
    }, [membership]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleServiceChange = (index: number, field: string, value: string | number) => {
        const updatedServices = [...formData.membershipsServices];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setFormData((prev) => ({
            ...prev,
            membershipsServices: updatedServices,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData.id, formData);
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
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Dịch Vụ:</label>
                {formData.membershipsServices && formData.membershipsServices.length > 0 ? (
                    formData.membershipsServices.map((service, index) => (
                        <div key={service.id} className="service-group">
                            <input
                                type="text"
                                value={service.serviceName}
                                onChange={(e) =>
                                    handleServiceChange(index, "serviceName", e.target.value)
                                }
                                className="form-control service-input"
                                placeholder="Tên dịch vụ"
                            />
                            <input
                                type="number"
                                value={service.maxPushTopAllowed}
                                onChange={(e) =>
                                    handleServiceChange(index, "maxPushTopAllowed", Number(e.target.value))
                                }
                                className="form-control service-input"
                                placeholder="Số lần đẩy top"
                            />
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
                    ))
                ) : (
                    <p className="no-services">Không có dịch vụ</p>
                )}
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Lưu
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default EditMembershipForm;
