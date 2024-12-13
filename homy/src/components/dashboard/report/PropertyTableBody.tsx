import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Table, Form, Button, Navbar, Nav } from "react-bootstrap";
import "./report.css";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import Loading from '@/components/Loading';
import { FaArrowDown, FaBuilding, FaCalendar, FaChartBar, FaChartLine, FaCoins, FaMoneyBillWave } from "react-icons/fa";

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
   totalRoomRevenue: number;
   totalCostOfMaintenance: number;
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

         let response;
         if (viewMode === "year") {
            response = await apiInstance.post<ApiResponse>(`/reports/yearly-revenue`, params);
         } else {
            response = await apiInstance.post<ApiResponse>(`/reports/monthly-revenue`, params);
         }


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
            if (response.data.data == null) {
               setIsLoading(false);
            }
         } else {
            console.error("Failed to load revenue data", response.data.errors);
            setIsLoading(false);
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
      <Container fluid>
         <Row>
            <Col md={3} lg={2} className="sidebar bg-light">
               <Navbar bg="light" expand="md" className="flex-md-column">
                  <Navbar.Brand className="text-primary font-weight-bold">
                     <FaChartBar className="mr-2" />
                     Báo Cáo Doanh Thu
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="sidebar-nav" />
                  <Navbar.Collapse id="sidebar-nav">
                     <Nav className="flex-column">
                        <Nav.Item>
                           <Form.Select
                              value={selectedHostel}
                              onChange={(e) => setSelectedHostel(e.target.value)}
                              className="my-2"
                           >
                              <option value="">Chọn nhà trọ</option>
                              {hostels.map((hostel) => (
                                 <option key={hostel.id} value={hostel.id}>
                                    {hostel.hostelName}
                                 </option>
                              ))}
                           </Form.Select>
                        </Nav.Item>
                        <Nav.Item>
                           <Form.Select
                              value={selectedMonth}
                              onChange={(e) => setSelectedMonth(Number(e.target.value))}
                              className="my-2"
                           >
                              {[...Array(12)].map((_, index) => (
                                 <option key={index} value={index + 1}>
                                    Tháng {index + 1}
                                 </option>
                              ))}
                           </Form.Select>
                        </Nav.Item>
                        <Nav.Item>
                           <Form.Select
                              value={selectedYear}
                              onChange={(e) => setSelectedYear(Number(e.target.value))}
                              className="my-2"
                           >
                              {years.length > 0 ? (
                                 years.map((year) => (
                                    <option key={year} value={year}>
                                       {year}
                                    </option>
                                 ))
                              ) : (
                                 <option value={2024}>2024</option>
                              )}
                           </Form.Select>
                        </Nav.Item>
                        <Nav.Item>
                           <Button
                              onClick={() => setViewMode("month")}
                              variant={viewMode === "month" ? "primary" : "outline-primary"}
                              className="my-2 w-100"
                           >
                              <FaCalendar className="mr-2" />
                              Xem Tháng
                           </Button>
                        </Nav.Item>
                        <Nav.Item>
                           <Button
                              onClick={() => setViewMode("year")}
                              variant={viewMode === "year" ? "primary" : "outline-primary"}
                              className="my-2 w-100"
                           >
                              <FaChartLine className="mr-2" />
                              Xem Năm
                           </Button>
                        </Nav.Item>
                     </Nav>
                  </Navbar.Collapse>
               </Navbar>
            </Col>
            <Col md={9} lg={10} className="main-content py-4">
               <Card>
                  <Card.Header className="bg-custom-primary text-white">
                     <h4 className="mb-0">
                        <FaChartBar className="mr-2" />
                        {viewMode === "year"
                           ? `Doanh Thu Năm ${selectedYear}`
                           : `Doanh Thu Tháng ${selectedMonth}/${selectedYear}`}
                     </h4>
                  </Card.Header>
                  <Card.Body>
                     <Row className="mb-4">
                        <Col sm={4}>
                           <Card bg="custom-success" text="white" className="mb-2 shadow">
                              <Card.Body>
                                 <Card.Title className="d-flex align-items-center">
                                    <FaMoneyBillWave className="mr-2" />
                                    Tổng Thu
                                 </Card.Title>
                                 <Card.Text className="h4 font-weight-bold mb-0">
                                    {formatCurrency(viewMode === "year" ? yearlyRevenue?.totalRoomRevenue || 0 : monthlyRevenue?.totalAllRevenue || 0)}
                                 </Card.Text>
                              </Card.Body>
                           </Card>
                        </Col>
                        <Col sm={4}>
                           <Card bg="custom-danger" text="white" className="mb-2 shadow">
                              <Card.Body>
                                 <Card.Title className="d-flex align-items-center">
                                    <FaArrowDown className="mr-2" />
                                    Tổng Chi
                                 </Card.Title>
                                 <Card.Text className="h4 font-weight-bold mb-0">
                                    {formatCurrency(viewMode === "year" ? yearlyRevenue?.totalCostOfMaintenance || 0 : 0)}
                                 </Card.Text>
                              </Card.Body>
                           </Card>
                        </Col>
                        <Col sm={4}>
                           <Card bg="custom-info" text="white" className="mb-2 shadow">
                              <Card.Body>
                                 <Card.Title className="d-flex align-items-center">
                                    <FaCoins className="mr-2" />
                                    Lợi Nhuận
                                 </Card.Title>
                                 <Card.Text className="h4 font-weight-bold mb-0">
                                    {formatCurrency(viewMode === "year" ? yearlyRevenue?.totalAllRevenue || 0 : monthlyRevenue?.totalAllRevenue || 0)}
                                 </Card.Text>
                              </Card.Body>
                           </Card>
                        </Col>
                     </Row>
                     <Table responsive className="revenue-table">
                        <thead>
                           <tr>
                              <th>
                                 <div className="d-flex align-items-center justify-content-center">
                                    <FaBuilding className="mr-2" />
                                    Phòng
                                 </div>
                              </th>
                              <th>
                                 <div className="d-flex align-items-center justify-content-center">
                                    <FaMoneyBillWave className="mr-2" />
                                    Doanh Thu
                                 </div>
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {(viewMode === "year" ? yearlyRevenue?.roomRevenueDetail : monthlyRevenue?.roomRevenueDetail)?.map((room, index) => (
                              <tr key={index}>
                                 <td>
                                    <div className="room-name">{room.roomName}</div>
                                 </td>
                                 <td>
                                    <div className="revenue-amount">{formatCurrency(room.totalRevenue)}</div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </Table>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         <style jsx>{`
      
      `}</style>
      </Container>

   );
};

export default PropertyTableBody;
