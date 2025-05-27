import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Clock, 
  Calendar, 
  ClipboardCheck, 
  AlertTriangle,
  CheckCircle, 
  UserMinus,
  TrendingUp
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;

  // Placeholder data - in a real app, this would come from API calls
  const stats = {
    totalEmployees: 124,
    presentToday: 98,
    absentToday: 26,
    lateToday: 12,
    pendingLeaves: 8,
    activeShifts: 5,
    attendanceRate: 79,
    onTimeRate: 89
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#0F52BA]">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-[#0F52BA]">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Present Today</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.presentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <UserMinus size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Absent Today</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.absentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Late Today</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.lateToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.pendingLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Shifts</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.activeShifts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 text-teal-600">
              <ClipboardCheck size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
              <TrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">On-Time Rate</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.onTimeRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity items */}
            <div className="border-l-4 border-green-500 pl-4 py-1">
              <p className="text-sm font-medium">John Doe checked in</p>
              <p className="text-xs text-gray-500">Today, 9:05 AM</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <p className="text-sm font-medium">Sarah Smith arrived late</p>
              <p className="text-xs text-gray-500">Today, 10:12 AM</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <p className="text-sm font-medium">Mike Johnson requested leave</p>
              <p className="text-xs text-gray-500">Today, 11:30 AM</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-1">
              <p className="text-sm font-medium">Lisa Brown approved for WFH</p>
              <p className="text-xs text-gray-500">Yesterday, 4:45 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;