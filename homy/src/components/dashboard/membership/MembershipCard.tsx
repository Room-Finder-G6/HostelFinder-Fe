import React from "react";
import styles from "./MembershipCard.module.css";

interface MembershipCardProps {
  name: string;
  description: string;
  price: number;
  discount: number;
  duration: number;
  services: {
    serviceName: string;
    maxPostsAllowed: number;
    maxPushTopAllowed: number;
  }[];
  membershipId: string;  // Thêm prop membershipId để sử dụng khi mua gói
  onBuyClick: (id: string) => void;  // Callback khi nhấn "Mua ngay"
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  name,
  description,
  price,
  discount,
  duration,
  services,
  membershipId,
  onBuyClick,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>{name}</div>
      <div className={styles.cardDescription}>{description}</div>
      <div className={styles.cardPrice}>
        {price.toLocaleString("vi-VN")} đ/tháng
        {discount > 0 && <span> (-{discount}%)</span>}
      </div>
      <ul>
        {services.map((service, index) => (
          <li key={index}>
            {service.serviceName}: {service.maxPostsAllowed} bài đăng,{" "}
            {service.maxPushTopAllowed} lượt đẩy
          </li>
        ))}
      </ul>
      <div className={styles.cardButtons}>
        <button
          className={`${styles.cardButton} ${styles.cardButtonPrimary}`}
          onClick={() => onBuyClick(membershipId)} // Gọi hàm mua gói khi nhấn
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;