'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch orders');
      
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Order Status handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Refresh list locally
      setOrders(prev =>
        prev.map(item => item._id === id ? { ...item, orderStatus: newStatus } : item)
      );
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Filter logic
  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => (o.orderStatus || 'Pending').toUpperCase() === filter);

  // Status Badge Helper
  const getStatusBadge = (status = 'PENDING') => {
    switch (status.toUpperCase()) {
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DELIVERED':
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage customer product purchases.</p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
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
      {loading && <div className="p-8 text-center text-gray-500 font-semibold">Loading orders...</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md font-semibold">{error}</div>}

      {/* ORDERS TABLE */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">
              No orders found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-800">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider font-bold text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Customer Info</th>
                    <th className="px-6 py-4">Items Ordered</th>
                    <th className="px-6 py-4">Shipping Address</th>
                    <th className="px-6 py-4">Total & Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {filteredOrders.map((order) => {
                    const currentStatus = (order.orderStatus || 'Pending').toUpperCase();
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/80 transition">
                        
                        {/* Customer Info */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.customerPhone}</div>
                          <div className="text-[11px] text-gray-400">{order.customerEmail}</div>
                        </td>

                        {/* Items Purchased */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {order.orderItems?.map((item, idx) => (
                              <div key={idx} className="text-xs text-gray-800">
                                <span className="font-semibold text-black">{item.name || 'Product'}</span> x{item.quantity}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Shipping Address */}
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-700 max-w-xs truncate">
                            {order.shippingAddress || order.customerAddress || 'N/A'}
                          </div>
                        </td>

                        {/* Total & Payment */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">Rs. {order.totalAmount}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              {order.paymentMethod}
                            </span>
                            <span className={`text-[11px] font-bold ${
                              order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {order.paymentStatus || 'PENDING'}
                            </span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(currentStatus)}`}>
                            {currentStatus}
                          </span>
                        </td>

                        {/* Quick Actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          {currentStatus === 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'Processing')}
                              className="bg-black text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800 transition"
                            >
                              Process
                            </button>
                          )}
                          
                          {currentStatus === 'PROCESSING' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'Shipped')}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 transition"
                            >
                              Ship
                            </button>
                          )}

                          {currentStatus === 'SHIPPED' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'Delivered')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition"
                            >
                              Deliver
                            </button>
                          )}

                          {currentStatus !== 'CANCELLED' && currentStatus !== 'DELIVERED' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'Cancelled')}
                              className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-100 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}