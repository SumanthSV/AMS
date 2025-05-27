import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Clock, Calendar, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  const [attendance, setAttendance] = useState<any>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await axios.get('/api/attendance/today');
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendance = async (type: 'check-in' | 'check-out') => {
    try {
      setIsCheckingIn(true);
      const endpoint = type === 'check-in' ? '/api/attendance/check-in' : '/api/attendance/check-out';
      await axios.post(endpoint);
      toast.success(`Successfully ${type === 'check-in' ? 'checked in' : 'checked out'}`);
      fetchTodayAttendance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${type}`);
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Employee Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-2xl font-bold" id="clock">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Attendance Action Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Today's Attendance</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleAttendance('check-in')}
              disabled={isCheckingIn || attendance?.checkIn}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Check In
            </button>
            <button
              onClick={() => handleAttendance('check-out')}
              disabled={isCheckingIn || !attendance?.checkIn || attendance?.checkOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Check Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Check In Time</span>
            </div>
            <p className="mt-2 text-xl font-semibold">
              {attendance?.checkIn 
                ? new Date(attendance.checkIn).toLocaleTimeString() 
                : '--:--'}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Check Out Time</span>
            </div>
            <p className="mt-2 text-xl font-semibold">
              {attendance?.checkOut 
                ? new Date(attendance.checkOut).toLocaleTimeString() 
                : '--:--'}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Status</span>
            </div>
            <p className="mt-2 text-xl font-semibold">
              {attendance?.status || 'Not Checked In'}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Work Hours</span>
            </div>
            <p className="mt-2 text-xl font-semibold">
              {attendance?.workHours ? `${attendance.workHours}h` : '0h'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Leave Balance</p>
              <h3 className="text-2xl font-bold">15 days</h3>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <h3 className="text-2xl font-bold">98%</h3>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late Marks</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-500">Checked in at 9:00 AM</span>
            <span className="ml-auto text-gray-400">Today</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-500">Leave request approved</span>
            <span className="ml-auto text-gray-400">Yesterday</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-gray-500">Shift changed to Morning</span>
            <span className="ml-auto text-gray-400">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;