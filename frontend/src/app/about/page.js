"use client";

import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="w-full bg-white text-black py-12 md:py-16">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Header & Bio */}
                    <div className="flex flex-col lg:col-start-1 lg:row-start-1">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                            Sagar Saru
                        </h1>
                        <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400 uppercase mb-6">
                            FOUNDER AND LEAD ARTIST
                        </p>

                        <div className="space-y-4 text-gray-800 text-sm sm:text-base leading-relaxed mb-2">
                            <p>
                                With a passion for precision, style, and modern grooming, Mr. Sagar is dedicated to helping every client look and feel their best. Combining expert barbering skills with a keen eye for detail, each haircut is carefully tailored to suit the client's personality, style, and individual preferences.
                            </p>
                            <p>
                                From classic cuts to modern trends, Mr. Sagar is committed to delivering high-quality grooming and a professional experience every time. More than just a barber, he believes that a great haircut is about confidence, self-expression, and leaving the chair feeling your absolute best.
                            </p>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full aspect-square sm:aspect-[4/5] lg:aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm lg:col-start-2 lg:row-start-1 lg:row-span-2">
                        <Image
                            src="/founder.jpg"
                            alt="sagar saru - founder & lead artist"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-start-1 lg:row-start-2">
                        <h2 className="text-2xl font-semibold tracking-tight mb-6">
                            Contact me
                        </h2>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-700">First name</label>
                                    <input
                                        type="text"
                                        placeholder="Sagar"
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-700">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Saru"
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="sagar@example.com"
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Your message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Enter your question or message"
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black transition-colors resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors mt-2"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}