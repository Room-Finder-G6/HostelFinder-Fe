import {useState, useEffect, useCallback} from "react";
import {toast} from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode";
import Loading from "@/components/Loading";
import './WalletManagement.css';
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

interface JwtPayload {
    UserId: string;
}

const WalletManagement = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [fullName, setFullName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

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

    const fetchUserProfile = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiInstance.get(`/users/${userId}`);
            if (response.data && response.data.data) {
                const {fullName, walletBalance} = response.data.data;
                setBalance(walletBalance);
                setFullName(fullName);
            } else {
                setError("Không nhận được dữ liệu người dùng.");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to fetch user profile.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            setUserId(userId);
        }
    }, [getUserIdFromToken]);

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId, fetchUserProfile]);

    const handleDeposit = async () => {
        if (depositAmount <= 0) {
            toast.error("Số tiền nạp phải lớn hơn 0.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('UserId', userId ?? '');
            formData.append('Amount', depositAmount.toString());

            // Gửi yêu cầu nạp tiền
            const response = await apiInstance.post(`/Membership/Deposit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.succeeded) {
                setTimeout(() => {
                    toast.success("Yêu cầu nạp tiền thành công! Vui lòng hoàn tất thanh toán.");
                }, 2000);

                // Lưu payment URL
                const paymentUrl = response.data.data.paymentUrl;
                setPaymentUrl(paymentUrl);

                // Chuyển hướng người dùng đến trang thanh toán ngay lập tức
                window.location.href = paymentUrl;
            } else {
                toast.error(response.data.message || "Nạp tiền thất bại.");
            }
        } catch (error) {
            console.error("Error depositing money:", error);
            toast.error("Đã xảy ra lỗi khi nạp tiền.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString();
    };

    const handleSelectAmount = (amount: number) => {
        setDepositAmount(amount);
    };

    const handleDepositInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép nhập số
        setDepositAmount(Number(value));
    };


    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="Quản lý ví"/>
            <div className="dashboard-container">
                {fullName && (
                    <div className="user-name">
                        <h4>Chào mừng, {fullName}!</h4>
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}

                <div className="wallet-card">
                    <h3 className="wallet-header">Số dư tài khoản</h3>
                    <div className="wallet-balance">
                        <p>{balance !== null ? `${formatCurrency(balance)} VND` : "Đang tải..."}</p>
                    </div>
                </div>

                <div className="deposit-card">
                    <h4 className="deposit-header">Nạp tiền vào tài khoản</h4>
                    <div className="amount-selection">
                        <button className="amount-button" onClick={() => handleSelectAmount(10000)}>10,000 VND</button>
                        <button className="amount-button" onClick={() => handleSelectAmount(50000)}>50,000 VND</button>
                        <button className="amount-button" onClick={() => handleSelectAmount(100000)}>100,000 VND
                        </button>
                        <button className="amount-button" onClick={() => handleSelectAmount(200000)}>200,000 VND
                        </button>
                        <button className="amount-button" onClick={() => handleSelectAmount(500000)}>500,000 VND
                        </button>
                        <button className="amount-button" onClick={() => handleSelectAmount(1000000)}>1,000,000 VND
                        </button>
                    </div>

                    <input
                        className="deposit-input"
                        type="text"
                        value={depositAmount ? depositAmount.toLocaleString("vi-VN") : ""}
                        onChange={handleDepositInputChange}
                        placeholder="Số tiền muốn nạp"
                    />

                    <button className="deposit-button" onClick={handleDeposit}>Nạp tiền</button>
                </div>
            </div>
        </div>
    );
};

export default WalletManagement;
