"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    CalendarCheck,
    PackageSearch,
    GraduationCap,
    ShoppingBag,
    LogOut,
    Bell,
    Users,
    Clock,
    Loader2
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [adminUser, setAdminUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    
    // State for dashboard metrics
    const [metrics, setMetrics] = useState({
        pendingAppointments: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        academyInquiries: 0,
        recentActivity: []
    });

    useEffect(() => {
        // 1. Security Check
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token && !user.role) {
            router.push("/admin/login");
            return;
        }

        setAdminUser(user);

        // 2. Fetch Dashboard Data
        const fetchDashboardData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const headers = { Authorization: `Bearer ${token}` };

                // Fetching all endpoints simultaneously
                const [appointmentsRes, ordersRes, productsRes, academyRes] = await Promise.all([
                    fetch(`${API_URL}/api/appointments`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/orders`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/products`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/academy`, { headers }).catch(() => null)
                ]);

                const appointments = appointmentsRes?.ok ? await appointmentsRes.json() : [];
                const orders = ordersRes?.ok ? await ordersRes.json() : [];
                const products = productsRes?.ok ? await productsRes.json() : [];
                const academyClasses = academyRes?.ok ? await academyRes.json() : [];

                // Calculate metrics
                const pendingApts = Array.isArray(appointments) ? appointments.filter(a => a.status === 'PENDING' || a.status === 'pending').length : 0;
                const pendingOrds = Array.isArray(orders) ? orders.filter(o => (o.orderStatus || 'PENDING').toUpperCase() === 'PENDING').length : 0;
                const lowStock = Array.isArray(products) ? products.filter(p => p.stockQuantity < 5 || p.stockCount < 5).length : 0;

                setMetrics({
                    pendingAppointments: pendingApts,
                    pendingOrders: pendingOrds,
                    lowStockProducts: lowStock,
                    academyInquiries: Array.isArray(academyClasses) ? academyClasses.length : 0,
                    recentActivity: Array.isArray(appointments) ? appointments.slice(0, 4) : []
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    // Handle clicking outside the notification dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                <p className="text-gray-500 font-medium">Loading Dashboard...</p>
            </div>
        );
    }

    // Calculate total notifications across all categories
    const totalNotifications = metrics.pendingAppointments + metrics.pendingOrders + metrics.academyInquiries;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-20">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Mamey's Admin</h2>
                    <p className="text-sm font-semibold text-gray-800 mt-1">Welcome, {adminUser?.name || 'Admin'}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl font-medium transition shadow-md shadow-gray-200">
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </Link>
                    <Link href="/admin/appointments" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl font-medium transition">
                        <CalendarCheck className="w-5 h-5" />
                        Appointments
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl font-medium transition">
                        <ShoppingBag className="w-5 h-5" />
                        Orders
                    </Link>
                    <Link href="/admin/inventory" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl font-medium transition">
                        <PackageSearch className="w-5 h-5" />
                        Shop Inventory
                    </Link>
                    <Link href="/admin/academy" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl font-medium transition">
                        <GraduationCap className="w-5 h-5" />
                        Academy
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-4 py-3 rounded-xl font-medium transition"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    
                    {/* Functional Notification Dropdown */}
                    <div className="relative" ref={notificationRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-500 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="View notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {totalNotifications > 0 && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                    <span className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                        {totalNotifications} New
                                    </span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {totalNotifications === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            You're all caught up! No new notifications.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {metrics.pendingOrders > 0 && (
                                                <Link href="/admin/orders" className="block p-4 hover:bg-gray-50 transition">
                                                    <p className="text-sm font-semibold text-gray-900">New Shop Orders</p>
                                                    <p className="text-sm text-gray-500 mt-1">You have {metrics.pendingOrders} order(s) waiting to be processed.</p>
                                                </Link>
                                            )}
                                            {metrics.pendingAppointments > 0 && (
                                                <Link href="/admin/appointments" className="block p-4 hover:bg-gray-50 transition">
                                                    <p className="text-sm font-semibold text-gray-900">Pending Appointments</p>
                                                    <p className="text-sm text-gray-500 mt-1">There are {metrics.pendingAppointments} new appointment request(s).</p>
                                                </Link>
                                            )}
                                            {metrics.academyInquiries > 0 && (
                                                <Link href="/admin/academy" className="block p-4 hover:bg-gray-50 transition">
                                                    <p className="text-sm font-semibold text-gray-900">Academy Enrollments</p>
                                                    <p className="text-sm text-gray-500 mt-1">You have {metrics.academyInquiries} academy inquiry/enrollment(s) to review.</p>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Appointments Metric */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-1">Pending Appointments</p>
                                <h3 className="text-3xl font-black text-gray-900">{metrics.pendingAppointments}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Orders Metric */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-1">Pending Orders</p>
                                <h3 className="text-3xl font-black text-gray-900">{metrics.pendingOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Inventory Metric */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-1">Low Stock Items</p>
                                <h3 className="text-3xl font-black text-gray-900">{metrics.lowStockProducts}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                                <PackageSearch className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Academy Metric */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-1">Academy Enrollments</p>
                                <h3 className="text-3xl font-black text-gray-900">{metrics.academyInquiries}</h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Recent Appointment Requests</h2>
                            <Link href="/admin/appointments" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-semibold transition">
                                View All
                            </Link>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            {metrics.recentActivity.length > 0 ? (
                                metrics.recentActivity.map((apt, index) => (
                                    <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{apt.customerName || "Customer Name"}</p>
                                                <p className="text-sm font-medium text-gray-500">Service: {apt.service || apt.serviceName || "Haircut"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 uppercase tracking-wide">
                                                {apt.status || 'PENDING'}
                                            </span>
                                            <p className="text-xs font-medium text-gray-500 mt-1">{apt.appointmentDate || (apt.date ? new Date(apt.date).toLocaleDateString() : '')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-10 text-center text-gray-500 font-medium">
                                    No recent activity to display.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}