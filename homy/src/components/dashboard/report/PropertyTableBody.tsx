import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import "./report.css";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import Loading from '@/components/Loading';

// Kiểu dữ liệu của chi tiết doanh thu phòng
interface RoomRevenue {
   year: any;
   roomName: string;
   totalRevenue: number;
}

// Kiểu dữ liệu của báo cáo doanh thu
interface ReportData {
   totalAllRevenue: number;
   roomRevenueDetail: RoomRevenue[];
}

// Kiểu dữ liệu phản hồi từ API
interface ApiResponse {
   succeeded: boolean;
   message: string | null;
   errors: string | null;
   data: ReportData;
}
interface JwtPayload {
   UserId: string;
}
interface RevenueParams {
   hostelId: string;
   year: number;
   month: number;
}

const PropertyTableBody = () => {
   const [yearlyRevenue, setYearlyRevenue] = useState<ReportData | null>(null);
   const [monthlyRevenue, setMonthlyRevenue] = useState<ReportData | null>(null);
   const [selectedYear, setSelectedYear] = useState<number>(2024);
   const [selectedMonth, setSelectedMonth] = useState<number>(11);
   const [viewMode, setViewMode] = useState<"year" | "month">("month");
   const [years, setYears] = useState<number[]>([]); // Danh sách các năm lấy từ response
   const [hostels, setHostels] = useState<any[]>([]); // Lưu danh sách nhà trọ
   const [selectedHostel, setSelectedHostel] = useState<string>(""); // Lưu ID của hostel được chọn
   const [isClient, setIsClient] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   // Hàm lấy userId từ token
   // Hàm lấy userId từ token
   const getUserIdFromToken = useCallback((): string | null => {
      const token = window.localStorage.getItem("token");
      if (token) {
         try {
            const decodedToken = jwtDecode<any>(token); // Dùng any để tránh lỗi kiểu
            return decodedToken.UserId;
         } catch (error) {
            console.error("Error decoding token:", error);
            return null;
         }
      }
      return null;
   }, []);

   // Lấy danh sách nhà trọ khi người dùng đăng nhập
   useEffect(() => {
      const fetchHostels = async () => {
         const landlordId = getUserIdFromToken();
         if (!landlordId) return;
         try {
            const response = await apiInstance.get(`/hostels/GetHostelsByLandlordId/${landlordId}`);
            if (response.data.succeeded) {
               setSelectedHostel(response.data.data[0].id);
               setHostels(response.data.data)
            } else {
               console.error("Failed to load hostels");
            }
         } catch (error) {
            console.error("Error fetching hostels:", error);
         }
      };
      fetchHostels();
   }, [getUserIdFromToken]);

   // Chỉ render trên client
   useEffect(() => {
      setIsClient(true);
   }, []);
   const fetchRevenue = async () => {
      try {
         setIsLoading(true);
         let url = '';
         const params: RevenueParams = { hostelId: selectedHostel, year: selectedYear, month: selectedMonth };

         if (viewMode === "year") {
            url = `/reports/yearly-revenue`;
         } else {
            url = `/reports/monthly-revenue`;
         }

         const response = await apiInstance.get<ApiResponse>(url, { params });

         if (response.data.succeeded && response.data.data) {
            if (viewMode === "year") {
               setYearlyRevenue(response.data.data);
               setMonthlyRevenue(null);
               const yearsFromData = response.data.data.roomRevenueDetail
                  .map((item) => item.year)
                  .filter((value, index, self) => self.indexOf(value) === index);
               setYears(yearsFromData);
            } else {
               setMonthlyRevenue(response.data.data);
               setYearlyRevenue(null);
            }
         } else {
            console.error("Failed to load revenue data", response.data.errors);
         }
      } catch (error) {
         console.error("Error fetching revenue data:", error);
      }
      finally {
         setIsLoading(false);
      }
   };
   // Lấy dữ liệu doanh thu theo hostelId, năm và tháng
   useEffect(() => {
      if (!selectedHostel) return; // Nếu chưa chọn hostel, không gọi API

      const params: RevenueParams = { hostelId: selectedHostel, year: selectedYear, month: selectedMonth };
      fetchRevenue();
   }, [selectedHostel, selectedYear, selectedMonth, viewMode]);

   // Định dạng tiền tệ
   const formatCurrency = (amount: number) => {
      return amount.toLocaleString("vi-VN", {
         style: "currency",
         currency: "VND",
      });
   };

   // Hiển thị thông tin theo kiểu tháng hoặc năm
   if (!isClient) return null;

   return (
      <Container className="mt-5">
         <Row>
            <Col>
               <h1>Báo Cáo Doanh Thu Phòng Trọ</h1>
            </Col>
         </Row>

         {/* Dropdown chọn hostel */}
         <Row className="mt-4">
            <Col>
               <Card>
                  <Card.Body>
                     <Row>
                        <Col>
                           <Form.Select
                              value={selectedHostel}
                              onChange={(e) => setSelectedHostel(e.target.value)}
                           >
                              <option value="">Chọn nhà trọ</option>
                              {hostels.map((hostel) => (
                                 <option key={hostel.id} value={hostel.id}>
                                    {hostel.hostelName}
                                 </option>
                              ))}
                           </Form.Select>
                        </Col>

                        {/* Chọn Tháng và Năm */}
                        <Col>
                           <Form.Select
                              value={selectedMonth}
                              onChange={(e) => setSelectedMonth(Number(e.target.value))}
                           >
                              {[...Array(12)].map((_, index) => (
                                 <option key={index} value={index + 1}>
                                    Tháng {index + 1}
                                 </option>
                              ))}
                           </Form.Select>
                        </Col>
                        <Col>
                           <Form.Select
                              value={selectedYear}
                              onChange={(e) => setSelectedYear(Number(e.target.value))}
                           >
                              {years.length > 0 ? (
                                 years.map((year) => (
                                    <option key={year} value={year}>
                                       {year}
                                    </option>
                                 ))
                              ) : (
                                 <option value={2024}>2024</option> // Mặc định năm 2024 nếu không có năm từ response
                              )}
                           </Form.Select>
                        </Col>
                        <Col>
                           <Button
                              onClick={() => setViewMode("month")}
                              variant={viewMode === "month" ? "primary" : "secondary"}
                              className="w-100"
                           >
                              Xem Tháng
                           </Button>
                        </Col>
                        <Col>
                           <Button
                              onClick={() => setViewMode("year")}
                              variant={viewMode === "year" ? "primary" : "secondary"}
                              className="w-100"
                           >
                              Xem Năm
                           </Button>
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Báo cáo doanh thu */}
         <Row className="mt-4">
            <Col>
               <Card>
                  <Card.Header>
                     <h5>
                        {viewMode === "year"
                           ? `Doanh Thu Năm ${selectedYear}`
                           : `Doanh Thu Tháng ${selectedMonth}/${selectedYear}`}
                     </h5>
                  </Card.Header>
                  <Card.Body>
                     {/* Render doanh thu theo tháng hoặc năm */}
                     {viewMode === "year" ? (
                        yearlyRevenue ? (
                           <>
                              <div className="revenue-summary d-flex justify-content-between align-items-center bg-light p-3">
                                 <div className="item receipt d-flex align-items-center">
                                    <div className="text-end mr-3">Tổng khoản thu (tiền vào)</div>
                                    <div className="value text-success d-flex align-items-center">
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-trending-up mr-2"
                                       >
                                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                          <polyline points="17 6 23 6 23 12"></polyline>
                                       </svg>
                                       <span className="total">{formatCurrency(yearlyRevenue.totalAllRevenue)}</span>
                                    </div>
                                 </div>

                                 <div className="item expense d-flex align-items-center">
                                    <div className="text-end mr-3">Tổng khoản chi (tiền ra)</div>
                                    <div className="value text-danger d-flex align-items-center">
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-trending-down mr-2"
                                       >
                                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                                          <polyline points="17 18 23 18 23 12"></polyline>
                                       </svg>
                                       <span className="total">{formatCurrency(0)}</span>
                                    </div>
                                 </div>

                                 <div className="item profit d-flex align-items-center">
                                    <div className="text-end mr-3">Lợi nhuận</div>
                                    <div className="value text-success d-flex align-items-center">
                                       <span className="total">{formatCurrency(yearlyRevenue.totalAllRevenue)}</span>
                                    </div>
                                 </div>
                              </div>
                              <Table striped bordered hover>
                                 <thead>
                                    <tr>
                                       <th>Phòng</th>
                                       <th>Doanh Thu</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {yearlyRevenue.roomRevenueDetail.map((room, index) => (
                                       <tr key={index}>
                                          <td>{room.roomName}</td>
                                          <td>{formatCurrency(room.totalRevenue)}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </Table>
                           </>
                        ) : (
                           <Loading />
                        )
                     ) : monthlyRevenue ? (
                        <>
                           <div className="revenue-summary d-flex justify-content-between align-items-center bg-light p-3">
                              <div className="item receipt d-flex align-items-center">
                                 <div className="text-end mr-3">Tổng khoản thu (tiền vào)</div>
                                 <div className="value text-success d-flex align-items-center">
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="24"
                                       height="24"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       stroke="currentColor"
                                       strokeWidth="2"
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       className="feather feather-trending-up mr-2"
                                    >
                                       <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                       <polyline points="17 6 23 6 23 12"></polyline>
                                    </svg>
                                    <span className="total">{formatCurrency(monthlyRevenue.totalAllRevenue)}</span>
                                 </div>
                              </div>

                              <div className="item expense d-flex align-items-center">
                                 <div className="text-end mr-3">Tổng khoản chi (tiền ra)</div>
                                 <div className="value text-danger d-flex align-items-center">
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="24"
                                       height="24"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       stroke="currentColor"
                                       strokeWidth="2"
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       className="feather feather-trending-down mr-2"
                                    >
                                       <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                                       <polyline points="17 18 23 18 23 12"></polyline>
                                    </svg>
                                    <span className="total">{formatCurrency(0)}</span>
                                 </div>
                              </div>

                              <div className="item profit d-flex align-items-center">
                                 <div className="text-end mr-3">Lợi nhuận</div>
                                 <div className="value text-success d-flex align-items-center">
                                    <span className="total">{formatCurrency(monthlyRevenue.totalAllRevenue)}</span>
                                 </div>
                              </div>
                           </div>
                           <Table striped bordered hover>
                              <thead>
                                 <tr>
                                    <th>Phòng</th>
                                    <th>Doanh Thu</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {monthlyRevenue.roomRevenueDetail.map((room, index) => (
                                    <tr key={index}>
                                       <td>{room.roomName}</td>
                                       <td>{formatCurrency(room.totalRevenue)}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </Table>
                        </>
                     ) : (
                        <Loading />
                     )}
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
};

export default PropertyTableBody;
