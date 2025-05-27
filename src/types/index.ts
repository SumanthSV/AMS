export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee' | 'HR';
  department: string | Department;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shift {
  _id: string;
  name: string;
  type: 'Flexible' | 'Fixed' | 'Rotational';
  startTime: string;
  endTime: string;
  assignedTo: string[] | User[];
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  employeeId: string | User;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'Present' | 'Late' | 'Absent' | 'Half-Day';
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  _id: string;
  employeeId: string | User;
  type: 'Sick' | 'Vacation' | 'WFH' | 'CompOff';
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  dates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SystemConfig {
  _id: string;
  gracePeriodMins: number;
  overtimeRules: {
    enabled: boolean;
    minHours: number;
    rate: number;
  };
  geoFencingEnabled: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  createdAt: string;
  updatedAt: string;
}