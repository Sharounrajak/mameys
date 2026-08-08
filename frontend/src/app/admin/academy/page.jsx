'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Star, StarOff, ArrowLeft, X } from 'lucide-react';

export default function AdminAcademyPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        duration: '',
        level: '',
        price: '',
        popular: false
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/academy`);
            if (!res.ok) throw new Error('Failed to fetch courses');
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePopularStatus = async (courseId, currentPopularStatus) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const res = await fetch(`${API_URL}/api/academy/${courseId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ popular: !currentPopularStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');
            
            const updatedCourse = await res.json();
            
            setCourses(prev => prev.map(course => 
                course._id === courseId ? { ...course, popular: updatedCourse.popular } : course
            ));
        } catch (err) {
            console.error(err);
            alert("Error updating course status");
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const res = await fetch(`${API_URL}/api/academy/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to delete course');
            
            // Remove the deleted course from local state
            setCourses(prev => prev.filter(course => course._id !== courseId));
        } catch (err) {
            console.error(err);
            alert("Error deleting course: " + err.message);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            const method = editingCourseId ? 'PUT' : 'POST';
            const endpoint = editingCourseId 
                ? `${API_URL}/api/academy/${editingCourseId}` 
                : `${API_URL}/api/academy`;

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error(editingCourseId ? 'Failed to update course' : 'Failed to create course');
            
            await fetchCourses(); // Refresh list after success
            closeModal();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setFormData({ title: '', category: '', duration: '', level: '', price: '', popular: false });
        setEditingCourseId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (course) => {
        setFormData({
            title: course.title || '',
            category: course.category || '',
            duration: course.duration || '',
            level: course.level || '',
            price: course.price || '',
            popular: course.popular || false
        });
        setEditingCourseId(course._id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourseId(null);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading courses...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
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

            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Course Management</h2>
                    <p className="text-gray-600 text-sm mt-1 font-medium">Add, update, or remove academy training programs.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Course
                </button>
            </div>

            {/* Admin Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-800 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">Course Title</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold">Duration / Level</th>
                                <th className="px-6 py-4 font-bold">Price</th>
                                <th className="px-6 py-4 font-bold text-center">Popular</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600 font-medium">
                                        No courses found. Click "New Course" to add one.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {course.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">
                                            <span className="bg-gray-200 text-gray-800 px-2.5 py-1 rounded-md text-xs font-bold">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">
                                            {course.duration} <br />
                                            <span className="text-xs font-semibold text-gray-500">{course.level}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-bold">
                                            {course.price}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => togglePopularStatus(course._id, course.popular)}
                                                className={`p-2 rounded-full transition-colors ${
                                                    course.popular 
                                                    ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200" 
                                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
                                                }`}
                                                title={course.popular ? "Remove Popular Status" : "Mark as Popular"}
                                            >
                                                {course.popular ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(course)}
                                                    className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition"
                                                    title="Edit Course"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(course._id)}
                                                    className="p-2 text-gray-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-extrabold text-black">
                                {editingCourseId ? 'Edit Course' : 'Add New Course'}
                            </h3>
                            <button 
                                onClick={closeModal}
                                className="text-gray-500 hover:text-black transition bg-gray-200 hover:bg-gray-300 rounded-full p-1.5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Course Title</label>
                                <input 
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 placeholder-gray-500 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g. Master Barbering Course"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">Category</label>
                                    <input 
                                        type="text"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 placeholder-gray-500 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="e.g. Haircut, Color"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">Price</label>
                                    <input 
                                        type="text"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 placeholder-gray-500 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="e.g. $499 or Free"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">Duration</label>
                                    <input 
                                        type="text"
                                        name="duration"
                                        required
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 placeholder-gray-500 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="e.g. 4 Weeks"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">Level</label>
                                    <input 
                                        type="text"
                                        name="level"
                                        required
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 placeholder-gray-500 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="e.g. Beginner, Advanced"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        name="popular"
                                        checked={formData.popular}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-black border-gray-400 rounded focus:ring-black"
                                    />
                                    <span className="text-sm font-bold text-gray-900">Mark as Popular Course</span>
                                </label>
                            </div>

                            <div className="pt-5 border-t border-gray-200 flex gap-3 justify-end">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition"
                                >
                                    {editingCourseId ? 'Save Changes' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}