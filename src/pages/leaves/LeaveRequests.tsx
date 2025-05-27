import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Calendar, Plus, Check, X, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface LeaveRequest {
  _id: string;
  employeeId: {
    name: string;
    employeeId: string;
  };
  type: string;
  status: string;
  reason: string;
  dates: string[];
  createdAt: string;
}

const LeaveRequests: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';
  
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/api/leaves' : '/api/leaves/me';
      const response = await axios.get(endpoint);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = async (data: any) => {
    try {
      await axios.post('/api/leaves', {
        ...data,
        dates: data.dates.split(',').map((date: string) => date.trim())
      });
      toast.success('Leave request submitted successfully');
      setShowNewRequestForm(false);
      reset();
      fetchLeaveRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'Approved' | 'Rejected') => {
    try {
      await axios.put(`/api/leaves/${requestId}/${status.toLowerCase()}`);
      toast.success(`Leave request ${status.toLowerCase()}`);
      fetchLeaveRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
        {!isAdmin && (
          <button
            onClick={() => setShowNewRequestForm(true)}
            className="flex items-center px-4 py-2 bg-[#0F52BA] text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        )}
      </div>

      {/* New Leave Request Form */}
      {showNewRequestForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">New Leave Request</h2>
          <form onSubmit={handleSubmit(handleNewRequest)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                {...register('type', { required: 'Leave type is required' })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Sick">Sick Leave</option>
                <option value="Vacation">Vacation</option>
                <option value="WFH">Work From Home</option>
                <option value="CompOff">Compensatory Off</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates (comma-separated)
              </label>
              <input
                type="text"
                {...register('dates', { required: 'Dates are required' })}
                placeholder="YYYY-MM-DD, YYYY-MM-DD"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.dates && (
                <p className="mt-1 text-sm text-red-600">{errors.dates.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                {...register('reason', { required: 'Reason is required' })}
                rows={3}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message as string}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowNewRequestForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0F52BA] text-white rounded-lg hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="px-6 py-4 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id}>
                    {isAdmin && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.employeeId.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {request.employeeId.employeeId}
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.dates.map(date => 
                          format(new Date(date), 'MMM dd, yyyy')
                        ).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}
                        ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${request.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {request.status}
                      </span>
                    </td>
                    {isAdmin && request.status === 'Pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'Approved')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;