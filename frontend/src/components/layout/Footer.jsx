import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand & Contact Details */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">Mamey's</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                        Mamey's Unisex Hair Studio. Exceptional hair care and styling for everyone.
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span>MFQF+VJ8, Butwal 32907</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span>+977 9800000000</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span>info@mameys.com</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
                    <nav className="flex flex-col gap-2 text-sm">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link href="/academy" className="hover:text-white transition-colors">Academy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                </div>

                {/* FontAwesome Social Media Icons */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Follow Us</h4>
                    <p className="text-sm text-gray-400">Connect with us on social media for transformations & updates.</p>

                    <div className="flex gap-3 mt-2">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-300 hover:bg-white hover:text-black transition-colors"
                            aria-label="Instagram"
                        >
                            <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                        </a>

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-300 hover:bg-white hover:text-black transition-colors"
                            aria-label="Facebook"
                        >
                            <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>

            {/* Copyright Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-900 text-center text-xs text-gray-500">
                © {currentYear} Mamey's Unisex Hair Studio. All rights reserved.
            </div>
        </footer>
    );
}