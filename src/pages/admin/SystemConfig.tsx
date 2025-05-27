import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Save, Settings, Bell, MapPin, Clock, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface SystemConfig {
  gracePeriodMins: number;
  overtimeRules: {
    enabled: boolean;
    minHours: number;
    rate: number;
  };
  geoFencingEnabled: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  lateMarkPenalty: {
    enabled: boolean;
    amount: number;
    maxPerMonth: number;
  };
  absentPenalty: {
    enabled: boolean;
    amount: number;
  };
  workingHours: {
    perDay: number;
    perWeek: number;
  };
  notificationSettings: {
    email: {
      enabled: boolean;
      events: {
        checkIn: boolean;
        checkOut: boolean;
        leaveRequest: boolean;
        leaveApproval: boolean;
        lateMarkWarning: boolean;
      };
    };
    sms: {
      enabled: boolean;
      events: {
        checkIn: boolean;
        checkOut: boolean;
        leaveRequest: boolean;
        leaveApproval: boolean;
        lateMarkWarning: boolean;
      };
    };
  };
}

const SystemConfig: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  const isAdmin = user?.role === 'Admin' || user?.role === 'HR';
  
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SystemConfig>();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/config');
      const config = response.data;
      
      // Set form values
      Object.keys(config).forEach(key => {
        setValue(key as keyof SystemConfig, config[key]);
      });
    } catch (error) {
      console.error('Error fetching system config:', error);
      toast.error('Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SystemConfig) => {
    try {
      await axios.put('/api/config', data);
      toast.success('System configuration updated successfully');
    } catch (error) {
      console.error('Error updating system config:', error);
      toast.error('Failed to update system configuration');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">System Configuration</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex items-center px-4 py-2 bg-[#0F52BA] text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Attendance Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Attendance Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grace Period (minutes)
              </label>
              <input
                type="number"
                {...register('gracePeriodMins', {
                  required: 'Grace period is required',
                  min: { value: 0, message: 'Must be 0 or greater' }
                })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.gracePeriodMins && (
                <p className="mt-1 text-sm text-red-600">{errors.gracePeriodMins.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Hours per Day
              </label>
              <input
                type="number"
                {...register('workingHours.perDay', {
                  required: 'Working hours per day is required',
                  min: { value: 1, message: 'Must be at least 1 hour' }
                })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.workingHours?.perDay && (
                <p className="mt-1 text-sm text-red-600">{errors.workingHours.perDay.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Hours per Week
              </label>
              <input
                type="number"
                {...register('workingHours.perWeek', {
                  required: 'Working hours per week is required',
                  min: { value: 1, message: 'Must be at least 1 hour' }
                })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.workingHours?.perWeek && (
                <p className="mt-1 text-sm text-red-600">{errors.workingHours.perWeek.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Overtime Rules */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Overtime Rules</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('overtimeRules.enabled')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Enable Overtime
              </label>
            </div>

            {watch('overtimeRules.enabled') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Hours
                  </label>
                  <input
                    type="number"
                    {...register('overtimeRules.minHours', {
                      required: 'Minimum hours is required',
                      min: { value: 0, message: 'Must be 0 or greater' }
                    })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overtime Rate
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('overtimeRules.rate', {
                      required: 'Rate is required',
                      min: { value: 1, message: 'Must be 1 or greater' }
                    })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Geo-fencing Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Geo-fencing Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('geoFencingEnabled')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Enable Geo-fencing
              </label>
            </div>

            {watch('geoFencingEnabled') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register('coordinates.latitude', {
                      required: 'Latitude is required'
                    })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register('coordinates.longitude', {
                      required: 'Longitude is required'
                    })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Radius (meters)
                  </label>
                  <input
                    type="number"
                    {...register('coordinates.radius', {
                      required: 'Radius is required',
                      min: { value: 1, message: 'Must be at least 1 meter' }
                    })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Penalty Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Penalty Settings</h2>
          </div>
          
          <div className="space-y-6">
            {/* Late Mark Penalty */}
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  {...register('lateMarkPenalty.enabled')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Enable Late Mark Penalty
                </label>
              </div>

              {watch('lateMarkPenalty.enabled') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penalty Amount
                    </label>
                    <input
                      type="number"
                      {...register('lateMarkPenalty.amount', {
                        required: 'Amount is required',
                        min: { value: 0, message: 'Must be 0 or greater' }
                      })}
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum per Month
                    </label>
                    <input
                      type="number"
                      {...register('lateMarkPenalty.maxPerMonth', {
                        required: 'Maximum per month is required',
                        min: { value: 1, message: 'Must be at least 1' }
                      })}
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Absent Penalty */}
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  {...register('absentPenalty.enabled')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Enable Absent Penalty
                </label>
              </div>

              {watch('absentPenalty.enabled') && (
                <div className="pl-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penalty Amount
                  </label>
                  <input
                    type="number"
                    {...register('absentPenalty.amount', {
                      required: 'Amount is required',
                      min: { value: 0, message: 'Must be 0 or greater' }
                    })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  {...register('notificationSettings.email.enabled')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Enable Email Notifications
                </label>
              </div>

              {watch('notificationSettings.email.enabled') && (
                <div className="space-y-2 pl-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.email.events.checkIn')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Check-in</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.email.events.checkOut')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Check-out</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.email.events.leaveRequest')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Leave Request</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.email.events.leaveApproval')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Leave Approval</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.email.events.lateMarkWarning')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Late Mark Warning</label>
                  </div>
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  {...register('notificationSettings.sms.enabled')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Enable SMS Notifications
                </label>
              </div>

              {watch('notificationSettings.sms.enabled') && (
                <div className="space-y-2 pl-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.sms.events.checkIn')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Check-in</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.sms.events.checkOut')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Check-out</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.sms.events.leaveRequest')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Leave Request</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.sms.events.leaveApproval')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Leave Approval</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('notificationSettings.sms.events.lateMarkWarning')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Late Mark Warning</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemConfig;