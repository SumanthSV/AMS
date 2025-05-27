import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import AttendanceLogs from './pages/attendance/AttendanceLogs';
import ShiftManagement from './pages/shifts/ShiftManagement';
import LeaveRequests from './pages/leaves/LeaveRequests';
import EmployeeManagement from './pages/employees/EmployeeManagement';
import DepartmentManagement from './pages/departments/DepartmentManagement';
import Analytics from './pages/reports/Analytics';
import SystemConfig from './pages/admin/SystemConfig';
import NotFound from './pages/errors/NotFound';
import PayrollPage from './pages/payroll/PayrollPage';

// Protected Route Component
const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  allowedRoles?: string[];
}> = ({ element, allowedRoles = [] }) => {
  const { state } = useAuth();
  const { isAuthenticated, isLoading, user } = state;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return <>{element}</>;
};

function AppRoutes() {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? (
          <Navigate to={user?.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />
        ) : (
          <Login />
        )} 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route 
          path="dashboard" 
          element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="employees" 
          element={<ProtectedRoute element={<EmployeeManagement />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="departments" 
          element={<ProtectedRoute element={<DepartmentManagement />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="shifts" 
          element={<ProtectedRoute element={<ShiftManagement />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="leaves" 
          element={<ProtectedRoute element={<LeaveRequests />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="payroll" 
          element={<ProtectedRoute element={<PayrollPage />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="attendance" 
          element={<ProtectedRoute element={<AttendanceLogs />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="analytics" 
          element={<ProtectedRoute element={<Analytics />} allowedRoles={['Admin', 'HR']} />} 
        />
        <Route 
          path="config" 
          element={<ProtectedRoute element={<SystemConfig />} allowedRoles={['Admin', 'HR']} />} 
        />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={<DashboardLayout />}>
        <Route 
          path="dashboard" 
          element={<ProtectedRoute element={<EmployeeDashboard />} allowedRoles={['Employee']} />} 
        />
        <Route 
          path="attendance" 
          element={<ProtectedRoute element={<AttendanceLogs />} allowedRoles={['Employee']} />} 
        />
        <Route 
          path="leaves" 
          element={<ProtectedRoute element={<LeaveRequests />} allowedRoles={['Employee']} />} 
        />
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;