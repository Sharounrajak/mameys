'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft} from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');




  
  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken'); 
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_URL}/api/appointments`, {

        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Appointments Data:", data); // Check if data actually arrives
      setAppointments(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      // THIS IS CRUCIAL: It ensures loading stops whether it succeeds OR fails
      setLoading(false); 
    }
  };
  useEffect(() => {
  fetchAppointments();
}, []); // The empty brackets are important!

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      // 1. Grab the token again
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // 2. Attach it to the PUT request headers
      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <- This is the line that fixes the 401
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized: Please log in again.');
        throw new Error('Failed to update appointment status');
      }

      const updatedAppointment = await res.json();

      // 3. Update your local state so the UI reflects the change immediately
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app._id === appointmentId ? { ...app, status: updatedAppointment.status } : app
        )
      );

    } catch (err) {
      console.error("Update error:", err);
      // Optional: Set an error state here to show a toast/alert to the user
    }
  };

  // Filter appointments
const filteredAppointments = filter.toUpperCase() === 'ALL' 
    ? appointments 
    : appointments.filter(app => (app.status || 'PENDING').toUpperCase() === filter.toUpperCase());
  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'; // PENDING
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
            <div className="mb-6">
                <Link 
                    href="/admin/dashboard" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
      {/* HEADER & FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Appointment Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Review and update customer salon bookings.</p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
                filter === st 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR / LOADING STATES */}
      {loading && <div className="p-8 text-center text-gray-500 font-semibold">Loading appointments...</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md font-semibold">{error}</div>}

      {/* APPOINTMENTS TABLE */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">
              No appointments found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-800">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider font-bold text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {filteredAppointments.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/80 transition">
                      
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{app.customerName}</div>
                        <div className="text-xs text-gray-500">{app.customerPhone}</div>
                      </td>

                      {/* Service Info */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{app.service}</div>
                        <div className="text-xs text-gray-500">Rs. {app.servicePrice}</div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{app.appointmentDate}</div>
                        <div className="text-xs text-gray-500">{app.timeSlot}</div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                          {app.paymentMethod}
                        </span>
                        <div className={`text-[11px] font-bold mt-1 ${
                          app.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {app.paymentStatus}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'CONFIRMED')}
                            className="bg-black text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800"
                          >
                            Confirm
                          </button>
                        )}
                        
                        {app.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'COMPLETED')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700"
                          >
                            Complete
                          </button>
                        )}

                        {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'CANCELLED')}
                            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-100"
                          >
                            Cancel
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}