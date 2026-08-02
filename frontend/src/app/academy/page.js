import Link from "next/link";
import {
    Clock,
    BarChart,
    Check,
    Award,
    Briefcase,
    GraduationCap,
    Phone
} from "lucide-react";

// Temporary mock data
const MOCK_COURSES = [
    {
        id: "1",
        title: "Master Hair Styling & Cutting",
        category: "Full Diploma",
        duration: "3 Months",
        level: "Beginner to Pro",
        price: "Rs. 35,000",
        description: "Learn foundational and modern cutting techniques, blow-outs, and styling using professional salon equipment.",
        syllabus: ["Sectioning & Tools", "Classic Cuts", "Layering Techniques", "Client Consultation"],
        popular: true,
    },
    {
        id: "2",
        title: "Advanced Hair Coloring & Balayage",
        category: "Specialization",
        duration: "6 Weeks",
        level: "Intermediate",
        price: "Rs. 25,000",
        description: "Master color theory, balayage, highlights, color correction, and post-color treatments.",
        syllabus: ["Color Theory", "Foil & Freehand", "Balayage Masterclass", "Toning & Care"],
        popular: false,
    },
    {
        id: "3",
        title: "Bridal & Event Hair Design",
        category: "Short Course",
        duration: "4 Weeks",
        level: "All Levels",
        price: "Rs. 18,000",
        description: "Specialized training for formal updos, bridal styles, texture techniques, and accessory placement.",
        syllabus: ["Prep & Volume", "Traditional Updos", "Modern Boho Styles", "Speed Styling"],
        popular: false,
    },
];

export default function AcademyPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Hero Section */}
            <section className="bg-white text-black py-20 px-4 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block bg-neutral-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-neutral-700">
                        Mamey's Hair Academy
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Turn Your Passion Into A <span className="text-black">Professional Career</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                        Hands-on training, industry-certified mentorship, and real salon experience to help you master modern hair styling.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="#courses"
                            className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                        >
                            Explore Courses
                        </a>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:bg-gray-300 border-gray-300">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Hands-on Practice</h3>
                        <p className="text-gray-600 text-sm">
                            Train on live models with guidance from active senior salon stylists.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:bg-gray-300 border-gray-300">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Certified Programs</h3>
                        <p className="text-gray-600 text-sm">
                            Receive an official Mamey's Hair Studio Academy certification upon graduation.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:bg-gray-300 border-gray-300">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Career Support</h3>
                        <p className="text-gray-600 text-sm">
                            Top graduates get placement opportunities directly inside Mamey's Studio.
                        </p>
                    </div>
                </div>
            </section>

            {/* Courses Catalog Section */}
            <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Our Training Programs</h2>
                    <p className="text-gray-600 mt-2">Select a course tailored to your skill level</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {MOCK_COURSES.map((course) => (
                        <div
                            key={course.id}
                            className={`bg-white rounded-2xl border ${course.popular ? "border-blue-500 shadow-md relative" : "border-gray-200"
                                } p-6 flex flex-col justify-between`}
                        >
                            {course.popular && (
                                <span className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    Most Popular
                                </span>
                            )}

                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {course.category}
                                </span>
                                <h3 className="text-xl font-bold mt-1 mb-2">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6 py-2 border-y border-gray-100">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {course.duration}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <BarChart className="w-4 h-4 text-gray-400" />
                                        {course.level}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Modules:</p>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        {course.syllabus.map((item, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-baseline justify-between mb-4">
                                    <span className="text-xs text-gray-500">Total Fee:</span>
                                    <span className="text-2xl font-bold text-black">{course.price}</span>
                                </div>

                                <Link
                                    href={`/academy/${course.id}`}
                                    className="block text-center w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
                                >
                                    View Details & Apply
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Inquiry CTA Section */}
            <section className="bg-white text-black py-16 mt-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Questions About Admissions?</h2>
                    <p className="text-gray-500 mb-8">
                        Speak directly with our Academy instructors to find out which program best suits your career goals.
                    </p>
                    <a
                        href="tel:+977 9824427455"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl transition mx-auto"
                    >
                        <Phone className="w-4 h-4" />
                        <span>Call Admissions</span>
                    </a>
                </div>
            </section>
        </div>
    );
}