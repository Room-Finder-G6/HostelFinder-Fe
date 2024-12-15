import React, { useState, useEffect } from "react";
import styles from "./EditMembershipForm.module.scss";
import { toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

interface Membership {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    membershipServices: {
        serviceName: string;
        maxPushTopAllowed: number;
        maxPostsAllowed: number;
    };
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
        duration: 0,
        membershipServices: {
            serviceName: "",
            maxPushTopAllowed: 0,
            maxPostsAllowed: 0,
        },
    });

    // Set initial form data when membership data is passed in
    useEffect(() => {
        if (membership) {
            setFormData({
                ...membership,
                membershipServices: membership.membershipServices 
             
            });
        }
    }, [membership]);
    console.log("Received Membership Data:", membership);

    // Handle input change for simple fields (name, description, price, duration)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle input change for membership service fields
    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            membershipServices: {
                ...prev.membershipServices,
                [name]: name === "maxPushTopAllowed" || name === "maxPostsAllowed" ? Number(value) : value,
            },
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedMembership = {
            ...formData,
            membershipServices: {
                ...formData.membershipServices,
                maxPushTopAllowed: Number(formData.membershipServices.maxPushTopAllowed),
                maxPostsAllowed: Number(formData.membershipServices.maxPostsAllowed),
            },
        };

        onSubmit(formData.id, updatedMembership);
        toast.success("Cập nhật thành công!");
    };

    return (
        
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles["form-group"]}>
                <label htmlFor="name" className={styles["form-label"]}>Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label htmlFor="description" className={styles["form-label"]}>Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label htmlFor="price" className={styles["form-label"]}>Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label htmlFor="duration" className={styles["form-label"]}>Duration</label>
                <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label htmlFor="serviceName" className={styles["form-label"]}>Service Name</label>
                <input
                    type="text"
                    id="serviceName"
                    name="serviceName"
                    value={formData.membershipServices.serviceName}
                    onChange={handleServiceChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label htmlFor="maxPushTopAllowed" className={styles["form-label"]}>Max Push Top Allowed</label>
                <input
                    type="number"
                    id="maxPushTopAllowed"
                    name="maxPushTopAllowed"
                    value={formData.membershipServices.maxPushTopAllowed}
                    onChange={handleServiceChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-group"]}>
                <label htmlFor="maxPostsAllowed" className={styles["form-label"]}>Max Posts Allowed</label>
                <input
                    type="number"
                    id="maxPostsAllowed"
                    name="maxPostsAllowed"
                    value={formData.membershipServices.maxPostsAllowed}
                    onChange={handleServiceChange}
                    className={styles["form-control"]}
                    required
                />
            </div>

            <div className={styles["form-actions"]}>
                <button type="submit" className={`${styles.btn} ${styles["btn-primary"]}`}>Save</button>
                <button type="button" onClick={onCancel} className={`${styles.btn} ${styles["btn-secondary"]}`}>Cancel</button>
            </div>
        </form>
    );
};

export default EditMembershipForm;