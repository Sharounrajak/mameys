"use client";

import { useState } from "react";
import Link from "next/link";

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
                <nav className="hidden md:flex gap-6 font-medium">
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
                    className="md:hidden p-2 text-black focus:outline-none"
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? (
                        /* Close Icon (X) */
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        /* Hamburger Icon */
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 flex flex-col gap-3 font-medium">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="hover:text-gray-600 transition-colors py-1 border-b border-gray-50"
                    >
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
            )}
        </header>
    );
}