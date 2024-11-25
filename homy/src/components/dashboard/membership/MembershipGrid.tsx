"use client";

import React from "react";
import styles from "./MembershipGrid.module.css";
import useMemberships from "./useMemberships";

const MembershipGrid = () => {
  const { memberships, loading, error } = useMemberships();

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Sort memberships by price (ascending)
  const sortedMemberships = memberships.sort((a, b) => a.price - b.price);

  return (
    <div className={styles.container}>
      {/* Membership Cards */}
      <div className={styles.grid}>
        {sortedMemberships.map((membership, index) => (
          <div key={membership.id} className={styles.card}>
            {/* Thêm icon trên đầu thẻ */}
            <div className={styles.iconWrapper}>
              <i className="fas fa-crown"></i> {/* Icon vương miện */}
            </div>

            {/* Tên gói */}
            <h3>{membership.name}</h3>

            {/* Mô tả gói */}
            <p className={styles.description} style={{ fontSize: "15px" }}>{membership.description}</p>

            {/* Giá gói */}
            <p className={styles.price}>
              {Number(membership.price).toLocaleString("vi-VN")} đ/tháng
            </p>

            {/* Danh sách dịch vụ */}
            <ul>
              <h6 style={{ fontSize: "17px", fontWeight: "bold", marginRight: "35px" }}>
                Gói tin hàng tháng
              </h6>
              {membership.membershipServices.map((service, idx) => (
                <ul key={idx} className={styles.serviceList}>
                  <li className={styles.serviceItem}>
                    <span className={styles.icon}>✔</span>
                    <span>
                      {service.maxPostsAllowed ? `${service.maxPostsAllowed} bài đăng` : ""}
                    </span>
                  </li>
                  {service.maxPushTopAllowed && (
                    <li className={styles.serviceItem}>
                      <span className={styles.icon}>✔</span>
                      <span>{`${service.maxPushTopAllowed} lượt đẩy`}</span>
                    </li>
                  )}
                </ul>
              ))}
            </ul>

            {/* Hành động */}
            {/* Actions */}
            <div className={styles.actions}>
              <button>Dùng thử 1 tháng</button>
              <button>Mua ngay</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipGrid;
