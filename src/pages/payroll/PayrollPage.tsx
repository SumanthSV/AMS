import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Download,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate: string;
}

const PayrollPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock payroll data
  const payrollRecords: PayrollRecord[] = [
    {
      id: '1',
      employeeName: 'Sushma',
      employeeId: 'EMP-2025-6901',
      department: 'Human Resources',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      status: 'paid',
      paymentDate: '2024-03-01',
    },
    {
      id: '2',
      employeeName: 'Prajwal KR',
      employeeId: 'EMP-2025-2698',
      department: 'Software Development',
      basicSalary: 4500,
      allowances: 800,
      deductions: 400,
      netSalary: 4900,
      status: 'processed',
      paymentDate: '2024-03-01',
    },
    {
      id: '3',
      employeeName: 'Vikas AS',
      employeeId: 'EMP-2025-2653',
      department: 'Software Development',
      basicSalary: 6000,
      allowances: 1200,
      deductions: 600,
      netSalary: 6600,
      status: 'pending',
      paymentDate: '-',
    },
  ];

  const stats = [
    {
      label: 'Total Payroll',
      value: `$${payrollRecords.reduce((acc, record) => acc + record.netSalary, 0).toLocaleString()}`,
      change: '+5.2%',
      trend: 'up',
    },
    {
      label: 'Basic Salary',
      value: `$${payrollRecords.reduce((acc, record) => acc + record.basicSalary, 0).toLocaleString()}`,
      change: '+3.8%',
      trend: 'up',
    },
    {
      label: 'Total Allowances',
      value: `$${payrollRecords.reduce((acc, record) => acc + record.allowances, 0).toLocaleString()}`,
      change: '+2.1%',
      trend: 'up',
    },
    {
      label: 'Total Deductions',
      value: `$${payrollRecords.reduce((acc, record) => acc + record.deductions, 0).toLocaleString()}`,
      change: '-1.5%',
      trend: 'down',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processed':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Payroll Management</h1>
          <p className="text-neutral-500">Process and manage employee payroll</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline flex items-center">
            <Download size={18} className="mr-2" />
            Export Report
          </button>
          <button className="btn-primary flex items-center">
            <DollarSign size={18} className="mr-2" />
            Process Payroll
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-neutral-500 text-sm">{stat.label}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-800">{stat.value}</span>
              <span className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payroll Records */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedMonth(newDate);
                }}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-neutral-700 font-medium">
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedMonth(newDate);
                }}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Allowances
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {payrollRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                        <span className="text-neutral-600 font-medium">
                          {record.employeeName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {record.employeeName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {record.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{record.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      ${record.basicSalary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">
                      +${record.allowances.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      -${record.deductions.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      ${record.netSalary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FileText size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-700">
            Showing <span className="font-medium">{payrollRecords.length}</span> records
          </div>
          <div className="flex gap-2">
            <button className="btn-outline px-3">Previous</button>
            <button className="btn-primary px-3">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;