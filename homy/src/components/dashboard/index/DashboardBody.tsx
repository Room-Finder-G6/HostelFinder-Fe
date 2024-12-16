"use client"

import { FC, useCallback, useEffect, useState } from 'react'
import {
   Building,
   People,
   DoorClosed,
   FileText,
   FileEarmarkText,
   Newspaper,
   IconProps
} from 'react-bootstrap-icons'
import apiInstance from '@/utils/apiInstance'
import DashboardHeaderTwo from '@/layouts/headers/dashboard/DashboardHeaderTwo'
import { jwtDecode } from 'jwt-decode'

interface DashboardData {
   hostelCount: number
   tenantCount: number
   roomCount: number
   occupiedRoomCount: number
   availableRoomCount: number
   allInvoicesCount: number
   unpaidInvoicesCount: number
   expiringContractsCount: number
   postCount: number
}

interface DashboardCardProps {
   icon: FC<IconProps>
   title: string
   value: string | number
   subValue?: string
   className?: string
   iconColor?: string
}
interface JwtPayload {
   UserId: string;
}

const DashboardCard: FC<DashboardCardProps> = ({
   icon: Icon,
   title,
   value,
   subValue,
   className,
   iconColor = "#0d6efd"
}) => (
   <div className={`card h-100 ${className ?? ''}`}>
      <div className="card-body">
         <div className="d-flex justify-content-between align-items-center">
            <div>
               <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
               <h2 className="card-title mb-0">{value}</h2>
               {subValue && <small className="text-muted">{subValue}</small>}
            </div>
            <div className="p-3 bg-light rounded">
               <Icon size={24} color={iconColor} />
            </div>
         </div>
      </div>
   </div>
)

const DashboardBody = () => {
   const [data, setData] = useState<DashboardData | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null);
   const [landlordId, setLandlordId] = useState<string | null>(null);

   const getUserIdFromToken = useCallback(() => {
      const token = window.localStorage.getItem("token")
      if (!token) {
         setError("Vui lòng đăng nhập để xem thông tin")
         setLoading(false)
         return null
      }

      try {
         const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token)
         if (!decodedToken.UserId) {
            setError("Token không hợp lệ")
            setLoading(false)
            return null
         }
         return decodedToken.UserId
      } catch (error) {
         console.error("Error decoding token:", error)
         setError("Lỗi xác thực người dùng")
         setLoading(false)
         return null
      }
   }, [])

   useEffect(() => {
      const userId = getUserIdFromToken()
      if (userId) {
         setLandlordId(userId)
      }
   }, [getUserIdFromToken])

   useEffect(() => {
      const fetchDashboardData = async () => {
         // Chỉ gọi API khi có landlordId
         if (!landlordId) return

         try {
            setLoading(true)
            const response = await apiInstance.get<DashboardData>(
               `/hostels/GetDashboardForLandlord?landlordId=${landlordId}`
            )
            setData(response.data)
         } catch (err) {
            if (err instanceof Error) {
               setError(`Không thể tải dữ liệu dashboard: ${err.message}`)
            } else {
               setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.')
            }
         } finally {
            setLoading(false)
         }
      }

      fetchDashboardData()
   }, [landlordId])
   if (loading) {
      return (
         <div className="d-flex justify-content-center align-items-center p-5">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Đang tải...</span>
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="alert alert-danger" role="alert">
            {error}
         </div>
      )
   }

   if (!data) return null

   const dashboardCards = [
      {
         icon: Building,
         title: 'Tổng số nhà trọ',
         value: data.hostelCount,
         iconColor: '#0d6efd' // primary
      },
      {
         icon: People,
         title: 'Tổng số người thuê',
         value: data.tenantCount,
         iconColor: '#198754' // success
      },
      {
         icon: DoorClosed,
         title: 'Tổng số phòng',
         value: data.roomCount,
         subValue: `${data.occupiedRoomCount} đã thuê - ${data.availableRoomCount} trống`,
         iconColor: '#6c757d' // secondary
      },
      {
         icon: FileText,
         title: 'Hóa đơn chưa thanh toán',
         value: data.unpaidInvoicesCount,
         subValue: `${data.allInvoicesCount} tổng hóa đơn`,
         iconColor: '#dc3545' // danger
      },
      {
         icon: FileEarmarkText,
         title: 'Hợp đồng sắp hết hạn',
         value: data.expiringContractsCount,
         iconColor: '#ffc107' // warning
      },
      {
         icon: Newspaper,
         title: 'Tổng số bài đăng',
         value: data.postCount,
         iconColor: '#0dcaf0' // info
      }
   ]

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Trang chủ" />
            <div className="container-fluid py-4">
               <div className="row g-4">
                  {dashboardCards.map((card, index) => (
                     <div key={index} className="col-lg-4 col-md-6">
                        <DashboardCard {...card} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}

export default DashboardBody