"use client"; // Dòng này cần có cho Next.js

import React from "react";
import styles from "./MembershipGrid.module.css"; // Import CSS
import useMemberships from "./useMemberships";

const MembershipGrid = () => {
  const { memberships, loading, error, buyMembership } = useMemberships();

  if (loading) {
    return (
      <div className={styles.spinner}></div> // Hiển thị vòng xoay khi đang tải dữ liệu
    );
  }
  
  if (error) return <p className="error-message">{error}</p>;

    // Sort memberships by price (ascending)
    const sortedMemberships = memberships.sort((a, b) => a.price - b.price);

  return (
    <div className={styles.container}>
      {/* Membership Cards */}
      <div className={styles.grid}>

        {sortedMemberships.map((membership) => (
          <div key={membership.id} className={styles.card}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-crown"></i> {/* Icon vương miện */}
            </div>
            <h3>{membership.name}</h3>
            <p className={styles.description} style={{ fontSize: "15px" }}>
              {membership.description}
            </p>
            <p className={styles.price}>
              {Number(membership.price).toLocaleString("vi-VN")} đ/tháng
            </p>
            <ul>
              <h6 style={{ fontSize: "17px", fontWeight: "bold", marginRight: "35px" }}>
                Gói tin hàng tháng
              </h6>
              
              {membership.membershipServices.map((service, idx) => (
                <ul key={idx} className={styles.serviceList}>
                  <li className={styles.serviceItem1}  style={{fontWeight: "700", textAlign: "center", fontSize: "14.5px"}}>
                    <span className={styles.icon}></span>
                    <span>{service.serviceName}</span>
                  </li>
                  <li className={styles.serviceItem}>
                    <span className={styles.icon}>✔</span>
                    <span>{`Số bài đăng: ${service.maxPostsAllowed}`}</span>
                  </li>
                  <li className={styles.serviceItem}>
                    <span className={styles.icon}>✔</span>
                    <span>{`Số lượt đẩy: ${service.maxPushTopAllowed}`}</span>
                  </li>
                  <li className={styles.serviceItem1}  style={{fontWeight: "700", textAlign: "center", fontSize: "14.5px"}}>
                    <span>{`Các dịch vụ khác`}</span>
                  </li>
                  <li className={styles.serviceItem}>
                    <span className={styles.icon}>✔</span>
                    <span>{`Tích hợp AI thông minh`}</span>
                  </li>
                  <li className={styles.serviceItem}>
                    <span className={styles.icon}>✔</span>
                    <span>{`Quản lí nhà trọ`}</span>
                  </li>
                  <li className={styles.serviceItem}>
                    <span className={styles.icon}>✔</span>
                    <span>{`Top bài đăng`}</span>
                  </li>
                </ul>
              ))}
            </ul>

            <div className={styles.actions}>
              <button onClick={() => buyMembership(membership.id)}>Mua ngay</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipGrid;