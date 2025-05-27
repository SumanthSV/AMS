import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Calendar,
  Clock,
  BarChart4,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Home,
  BellRing,
  Building
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { state, logout } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';
  const basePath = isAdmin ? '/admin' : '/employee';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { name: 'Dashboard', path: `${basePath}/dashboard`, icon: <Home size={20} /> },
    { name: 'Employees', path: `${basePath}/employees`, icon: <Users size={20} /> },
    { name: 'Departments', path: `${basePath}/departments`, icon: <Building size={20} /> },
    { name: 'Shifts', path: `${basePath}/shifts`, icon: <Clock size={20} /> },
    { name: 'Payroll', path: `${basePath}/payroll`, icon: <Calendar size={20} /> },
    { name: 'Leave Requests', path: `${basePath}/leaves`, icon: <Calendar size={20} /> },
    { name: 'Attendance', path: `${basePath}/attendance`, icon: <FileText size={20} /> },
    { name: 'Analytics', path: `${basePath}/analytics`, icon: <BarChart4 size={20} /> },
    { name: 'System Config', path: `${basePath}/config`, icon: <Settings size={20} /> }
  ];

  const employeeMenuItems = [
    { name: 'Dashboard', path: `${basePath}/dashboard`, icon: <Home size={20} /> },
    { name: 'My Attendance', path: `${basePath}/attendance`, icon: <FileText size={20} /> },
    { name: 'My Leaves', path: `${basePath}/leaves`, icon: <Calendar size={20} /> }
  ];

  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside 
        className={`bg-[#0F52BA] text-white w-64 fixed h-full transform transition-transform duration-300 ease-in-out z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:relative`}
      >
        {/* Close button for mobile view */}
        <button 
          className="lg:hidden absolute right-4 top-4 text-white"
          onClick={closeSidebar}
        >
          <X size={24} />
        </button>

        {/* Company name/logo */}
        <div className="p-5 border-b border-blue-800">
          <h1 className="text-xl font-bold">AMS-SM24E</h1>
          <p className="text-sm text-blue-200">Attendance Management</p>
        </div>

        {/* Navigation menu */}
        <nav className="mt-5 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-3 my-1 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={closeSidebar}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 w-full border-t border-blue-800 p-4 bg-blue-900">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-blue-300">{user?.role || 'Employee'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-2 rounded-full hover:bg-blue-800"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="lg:hidden focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-gray-100 relative">
                <BellRing size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="lg:flex items-center hidden">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="ml-2 font-medium">{user?.name || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;