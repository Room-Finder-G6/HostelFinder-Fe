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
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  name,
  description,
  price,
  discount,
  duration,
  services,
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
            {service.maxPushTopAllowed} lượt đẩy,
            {service.maxPostsAllowed} lượt đăng
          </li>
        ))}
      </ul>
      <div className={styles.cardButtons}>
        <button className={`${styles.cardButton} ${styles.cardButtonPrimary}`}>
          Dùng thử 1 tháng
        </button>
        <button className={`${styles.cardButton} ${styles.cardButtonSecondary}`}>
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;
