export interface MaintenanceRecord {
    hostelId: string | null;
    roomId: string | null;
    hostelName: string | null;
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

  export enum MaintenanceType {
    Electrical = 0, 
    Plumbing = 1,    
    Painting = 2,     
    General = 3,       
    Other = 4           
  }

  export interface AddMaintenanceRecord {
    hostelId: string ;
    roomId: string | null;
    title: string;
    description: string | null;
    maintenanceDate: string; 
    cost: number;
    maintenanceType: number;
  }
  