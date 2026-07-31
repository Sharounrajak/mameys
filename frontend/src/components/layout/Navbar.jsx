import Link from "next/link";

export default function Navbar() {
    return(
        <header className="bg-white text-black shadow-md">

            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

                <Link href="/" className="text-2xl font-bold tracking-tight hover:text-gray-300 transition">
                    Mamey's
                </Link>

                <nav className="flex gap-6 font-medium">

                    <Link href="/" className="hover:text-blue-400 transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-blue-400 transition-colors">
                        About
                    </Link>
                    <Link href="/academy" className="hover:text-blue-400 transition-colors">
                        Academy
                    </Link>
                    <Link href="/shop" className="hover:text-blue-400 transition-colors">
                        Shop
                    </Link>
                    
                </nav>

            </div>
        </header>
    );
}