import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";
import Loading from "@/components/Loading";
import DeleteModal from "@/modals/DeleteModal";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
 
interface Address {
  province: string;
  district: string;
  commune: string;
  detailAddress: string;
}
 
interface DataType {
  id: string;
  hostelName: string;
  address: Address;
  numberOfRooms: number;
  imageUrl: string | null;
  createdOn: string;
  size: number | 0;
}
 
interface JwtPayload {
  UserId: string;
}
 
const PropertyTableHostel = ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  const [hostels, setHostels] = useState<DataType[]>([]);
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to get UserId from token in localStorage
  const getUserIdFromToken = useCallback(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        return decodedToken.UserId;
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error decoding user token");
        return null;
      }
    }
    setError("No token found");
    return null;
  }, []);
 
  // Fetching landlordId from the token when component mounts
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      setLandlordId(userId);
    }
  }, [getUserIdFromToken]);
 
  // Fetching hostel data for the current landlord
  const fetchHostels = useCallback(async () => {
    if (!landlordId) {
      return;
    }
 
    setIsLoading(true);
    setError(null);
 
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
 
      const response = await apiInstance.get(
        `hostels/GetHostelsByLandlordId/${landlordId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (Array.isArray(response.data.data)) {
        setHostels(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching hostels:", error);
      setError(error.message || "An error occurred while fetching hostels");
    } finally {
      setIsLoading(false);
    }
  }, [landlordId, pageNumber, pageSize]);
 
  // Fetching data when landlordId is set
  useEffect(() => {
    if (landlordId) {
      fetchHostels();
    }
  }, [landlordId, fetchHostels]);
 
  // Handle delete hostel
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
 
      await apiInstance.delete(`hostels/DeleteHostel/${id}`);
 
      // Refetch the data after successful deletion
      await fetchHostels();
      toast.success("Hostel deleted successfully");
    } catch (error: any) {
      console.error("Error deleting hostel:", error);
      setError(error.message || "An error occurred while deleting the hostel");
    } finally {
      setIsLoading(false);
    }
  };
 
  // Open delete modal
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };
 
  // Close delete modal
  const closeDeleteModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };
 
  // Loading, error or no data handling
  if (isLoading) {
    return (
      <tbody>
        <Loading />
      </tbody>
    );
  }
 
  if (error) {
    return (
      <tbody>
        <tr>
          <td colSpan={4}>Error: {error}</td>
        </tr>
      </tbody>
    );
  }
 
  if (hostels.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={4}>Hiện chưa có nhà trọ nào.</td>
        </tr>
      </tbody>
    );
  }
 
  return (
    <>
      <DeleteModal
        show={showModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this hostel? All data will be lost."
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
          closeDeleteModal();
        }}
        onCancel={closeDeleteModal}
      />
      <tbody className="border-0">
        {hostels.map((item) => (
          <tr key={item.id}>
            <td>
              <div className="d-lg-flex align-items-center position-relative">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    width={200}
                    height={200}
                    style={{ objectFit: "cover", borderRadius: "15px", aspectRatio: '18 / 12' }}
                  />
                )}
                <div className="ps-lg-4 md-pt-10">
                  <Link
                    href={`./manage-room?hostelId=${item.id}`}
                    className="property-name tran3s color-dark fw-500 fs-20 stretched-link"
                  >
                    {item.hostelName}
                  </Link>
                  <div className="address">
                    {`${item.address.commune}, ${item.address.district}, ${item.address.province}`}
                  </div>
                  <strong className="color-dark">
                    {item.numberOfRooms} phòng
                  </strong>
                </div>
              </div>
            </td>
            <td>{formatDate(item.createdOn)}</td>
            <td>{item.size}m²</td>
            <td>
              <div className="action-dots float-end">
                <button
                  className="action-btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      className="dropdown-item"
                      href={`/dashboard/edit-hostel/${item.id}`}
                    >
                      <Image src={icon_3} alt="" className="lazy-img" /> Xem và sửa
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      href="#"
                      onClick={() => openDeleteModal(item.id)}
                    >
                      <Image src={icon_4} alt="" className="lazy-img" /> Xóa
                    </Link>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
 
export default PropertyTableHostel;
