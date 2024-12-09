// components/HeartButton.tsx
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa"; // Thêm icon trái tim từ react-icons

interface HeartButtonProps {
  wishlistCount: number;
}

const HeartButton: React.FC<HeartButtonProps> = ({ wishlistCount }) => {
  return (
    <Link className="nav-link d-flex align-items-center gap-2" href="/favorite">
      <FaRegHeart size={24} />
      {/* Chỉ hiển thị số lượng nếu có wishlist */}
      {wishlistCount > 0 && (
        <span className="wishlist-badge" style={{ fontSize: '14px', color: 'white', backgroundColor: 'red' }}>
          {wishlistCount}
          
        </span>
        
      )}
      
    </Link>
  );
};

export default HeartButton;
