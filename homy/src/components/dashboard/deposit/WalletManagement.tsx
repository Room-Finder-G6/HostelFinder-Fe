import React, {useState, useEffect, useCallback} from "react";
import {toast} from "react-toastify";
import {Wallet, CreditCard, ArrowUpCircle} from "lucide-react";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode";
import Loading from "@/components/Loading";
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

            const response = await apiInstance.post(`/Membership/Deposit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.succeeded) {
                setTimeout(() => {
                    toast.success("Yêu cầu nạp tiền thành công! Vui lòng hoàn tất thanh toán.");
                }, 2000);

                const paymentUrl = response.data.data.paymentUrl;
                setPaymentUrl(paymentUrl);
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
        const value = e.target.value.replace(/\D/g, "");
        setDepositAmount(Number(value));
    };

    if (isLoading) {
        return <Loading/>;
    }

    const predefinedAmounts = [
        {value: 10000, label: "10,000"},
        {value: 50000, label: "50,000"},
        {value: 100000, label: "100,000"},
        {value: 200000, label: "200,000"},
        {value: 500000, label: "500,000"},
        {value: 1000000, label: "1,000,000"}
    ];

    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="Quản lý ví"/>
            <div className="container py-4">
                {/* Welcome Card */}
                {fullName && (
                    <div className="card mb-4 bg-success bg-opacity-75 text-white">
                        <div className="card-body">
                            <div className="d-flex align-items-center gap-3">
                                <Wallet className="fs-1"/>
                                <div>
                                    <p className="mb-0">Xin chào</p>
                                    <h2 className="mb-0">{fullName}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Balance Card */}
                <div className="card mb-4">
                    <div className="card-header bg-white">
                        <h5 className="card-title mb-0">Số dư tài khoản</h5>
                    </div>
                    <div className="card-body">
                        <div className="bg-light p-4 rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <CreditCard className="text-success"/>
                                    <span>Tổng số dư</span>
                                </div>
                                <span className="fs-4 fw-bold text-success">
                                  {balance !== null ? `${formatCurrency(balance)} VND` : "Đang tải..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deposit Card */}
                <div className="card">
                    <div className="card-header bg-white">
                        <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                            <ArrowUpCircle className="text-success"/>
                            <span>Nạp tiền vào tài khoản</span>
                        </h5>
                    </div>
                    <div className="card-body">
                        {/* Amount Selection Grid */}
                        <div className="row g-3 mb-4">
                            {predefinedAmounts.map((amount) => (
                                <div key={amount.value} className="col-6 col-md-4">
                                    <button
                                        onClick={() => handleSelectAmount(amount.value)}
                                        className={`btn w-100 ${
                                            depositAmount === amount.value
                                                ? 'btn-success'
                                                : 'btn-outline-success'
                                        }`}
                                    >
                                        {amount.label} VND
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Custom Amount Input */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-center">
                                <input
                                    type="text"
                                    value={depositAmount ? depositAmount.toLocaleString("vi-VN") : ""}
                                    onChange={handleDepositInputChange}
                                    placeholder="Nhập số tiền muốn nạp"
                                    className="form-control form-control-lg mb-3 w-50 text-center"
                                />
                            </div>

                            <div className="d-flex justify-content-center">
                                <button
                                    onClick={handleDeposit}
                                    className="btn btn-success btn-lg w-25"
                                >
                                    Xác nhận nạp tiền
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletManagement;