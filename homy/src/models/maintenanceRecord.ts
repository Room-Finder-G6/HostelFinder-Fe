export interface MaintenanceRecord {
    hostelId: string;
    roomId: string | null;
    hostelName: string;
    roomName: string | null;
    title: string;
    description: string | null;
    maintenanceDate: string; 
    cost: number;
    maintenanceType: number;
  }
  
  export interface PagedResponse<T> {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    succeeded: boolean;
    message: string | null;
    errors: string[] | null;
    data: T[];
  }
  
  export enum SortDirection {
    Ascending = 0,
    Descending = 1,
  }
  