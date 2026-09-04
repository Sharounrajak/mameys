"use client";

import { useState } from "react";
import Link from "next/link";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white text-black shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                {/* Brand Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight hover:text-gray-600 transition-colors">
                    Mamey's
                </Link>

                {/* Desktop Navigation (Hidden on mobile, visible on md screens and up) */}
                <nav className="hidden md:flex gap-6 font-semibold">
                    <Link href="/" className="hover:text-gray-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-gray-600 transition-colors">
                        About
                    </Link>
                    <Link href="/academy" className="hover:text-gray-600 transition-colors">
                        Academy
                    </Link>
                    <Link href="/shop" className="hover:text-gray-600 transition-colors">
                        Shop
                    </Link>
                </nav>

                {/* Mobile Hamburger Button (Visible only on mobile) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                    aria-label="Toggle navigation menu"
                >
                    {/* Top Line */}
                    <span
                        className={`h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-in-out 
                            ${isOpen ? "rotate-45 translate-y-[8px]" : ""}`}
                    />
                    {/* Middle Line */}
                    <span
                        className={`h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-in-out 
                            ${isOpen ? "opacity-0 -translate-x-2" : "opacity-100"}`}
                    />
                    {/* Bottom Line */}
                    <span
                        className={`h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-in-out 
                            ${isOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
                    />
                </button>

            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden grid transition-all duration-300 ease-in-out ${isOpen
                ? "grid-rows-[1fr] opacity-100 border-b border-gray-100"
                : "grid-rows-[0fr] opacity-0"
                }`}>
                <div className="overflow-hidden">
                    <div className="bg-white px-4 pt-2 pb-6 flex flex-col gap-3 font-semibold">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-600 transition-colors py-1 border-b border-gray-50">
                            Home
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-600 transition-colors py-1 border-b border-gray-50"
                        >
                            About
                        </Link>
                        <Link
                            href="/academy"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-600 transition-colors py-1 border-b border-gray-50"
                        >
                            Academy
                        </Link>
                        <Link
                            href="/shop"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-600 transition-colors py-1"
                        >
                            Shop
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}