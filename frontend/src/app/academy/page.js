'use client';

import { useState, useEffect } from "react";
import {
    Clock,
    BarChart,
    Check,
    Award,
    Briefcase,
    GraduationCap,
    MessageCircle,
    Loader2
} from "lucide-react";

export default function AcademyPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Phone number for WhatsApp inquiries
    const adminPhone = "9779824427455";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const response = await fetch(`${API_URL}/api/academy`);
                
                if (!response.ok) throw new Error("Failed to fetch academy courses");

                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Redirects to WhatsApp with a pre-filled enrollment request
    const handleEnrollment = (courseTitle) => {
        const message = `Hello! I am interested in enrolling in the "${courseTitle}" academy program. Could you please provide more details on the admission process?`;
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Hero Section */}
            <section className="bg-white text-black py-20 px-4 text-center relative overflow-hidden border-b border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Turn Your Passion Into A <span className="text-black">Professional Career</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                        Hands-on training, industry-certified mentorship, and real salon experience to help you master modern hair styling.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="#courses"
                            className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                        >
                            Explore Courses
                        </a>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Hands-on Practice</h3>
                        <p className="text-gray-600 text-sm">Train on live models with guidance from active senior salon stylists.</p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Certified Programs</h3>
                        <p className="text-gray-600 text-sm">Receive an official Mamey's Hair Studio Academy certification upon graduation.</p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Career Support</h3>
                        <p className="text-gray-600 text-sm">Top graduates get placement opportunities directly inside Mamey's Studio.</p>
                    </div>
                </div>
            </section>

            {/* Courses Catalog Section */}
            <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Our Training Programs</h2>
                    <p className="text-gray-600 mt-2">Select a course tailored to your skill level</p>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <p className="text-sm">Loading academy classes...</p>
                    </div>
                )}

                {error && <div className="text-center py-12 text-red-500"><p>{error}</p></div>}
                {!loading && !error && courses.length === 0 && (
                    <div className="text-center py-12 text-gray-500"><p>No active academy classes available at the moment.</p></div>
                )}

                {!loading && !error && courses.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className={`bg-white rounded-2xl border ${
                                    course.popular ? "border-blue-500 shadow-md relative" : "border-gray-200"
                                } p-6 flex flex-col justify-between`}
                            >
                                {course.popular && (
                                    <span className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                )}

                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {course.category || "Academy Program"}
                                    </span>
                                    <h3 className="text-xl font-bold mt-1 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6 py-2 border-y border-gray-100">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {course.duration || "Self-paced"}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            <BarChart className="w-4 h-4 text-gray-400" />
                                            {course.level || "All Levels"}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Modules:</p>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            {course.syllabus && course.syllabus.length > 0 ? (
                                                course.syllabus.map((item, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-400 italic">Syllabus coming soon</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-baseline justify-between mb-4 mt-4">
                                        <span className="text-xs text-gray-500">Total Fee:</span>
                                        <span className="text-2xl font-bold text-black">{course.price || "Contact Us"}</span>
                                    </div>

                                    <button
                                        onClick={() => handleEnrollment(course.title)}
                                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-medium hover:bg-[#1ebd5b] transition"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Enroll via WhatsApp
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}