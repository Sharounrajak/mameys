import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return(
    <div className="w-full bg-white text-black">

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* {Hero Section} */}
        <section className="py-12 flex flex-col gap-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighe mb-4">
              Mamey's Unisex Hair Studio.
            </h1>
            <p className="text-gray-600 text-bass md:text-lg mb-8 max-w-2xl landing-relaxed">
              Discover a fresh approach to hair care and styling. Whether you're after a bold transformation or a simple refresh, we're here to make every visit feel exceptional.
            </p>
            <Link 
              href="/booking"
              className="inline-block bg-black text-white px-6 py-3 text-sm font-medium rounded-md hover:bg-gray-800 transition"
            >
              Book an appoinment
            </Link>
          </div>

          {/* {Hero image (salon wide image)} */}
          <div className="w-full h-[300px] md:h-[500px] relative rounded-sm overflow-hidden bg-gray-100 mt-4">
            <Image 
              src="/hero-interior.jpg"
              alt="mamey's interior"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* --- PORTFOLIO SECTION --- */}
        <section className="py-16 overflow-hidden">
          <h2 className="text-3xl font-bold mb-8 tracking-tight">Portfolio</h2>
          
          {/* Marquee Wrapper */}
          <div className="flex w-max animate-scroll hover:[animation-play-state:paused] gap-6">
            
            <div className="flex gap-6">
              <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/portfolio1.jpg" 
                  alt="Men's fade haircut" 
                  fill 
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover" 
                />
              </div>
              
              <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/portfolio2.jpg" 
                  alt="Women's layered cut" 
                  fill 
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover" 
                />
              </div>
              
              <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/portfolio3.jpg" 
                  alt="Men's mullet haircut" 
                  fill 
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Duplicate for smooth infinite loop */}
            <div className="flex gap-6">
              <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/portfolio1.jpg" 
                  alt="Men's fade haircut" 
                  fill 
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover" 
                />
              </div>
              
              <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/portfolio2.jpg" 
                  alt="Women's layered cut" 
                  fill 
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover" 
                />
              </div>
              
              <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/portfolio3.jpg" 
                  alt="Men's mullet haircut" 
                  fill 
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover" 
                />
              </div>
            </div>

          </div>
        </section>

        {/* ---  LOCATION SECTION --- */}
        <section className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-bold tracking-tight mb-2">Where to find us?</h2>
              
              <div>
                <p className="font-bold text-lg">MFQF+VJ8, Butwal 32907</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Opening hours</p>
                <p className="text-gray-600 text-sm">7AM - 9PM, all week</p>
              </div>
              
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="inline-block bg-[#EBEBEB] text-black px-6 py-2.5 text-sm font-medium rounded-md hover:bg-gray-300 transition"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Interactive Google Map */}
            <div className="relative w-full aspect-video md:aspect-[16/10] rounded-sm overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500.5502223719162!2d83.47410786032926!3d27.68975168979317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996870021e67bbb%3A0xa56642c1ec05c091!2sMameys%20Hair%20Studio!5e1!3m2!1sen!2snp!4v1785140248031!5m2!1sen!2snp"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mamey's Hair Studio Location"
              ></iframe>
            </div>

          </div>
        </section>

        {/* --- WHAT WE OFFER SECTION --- */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 tracking-tight">What we offer.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="p-8 border-gray-200 rounded-md bg-white bg-white hover:bg-black hover:text-white transition-colors">
            <h3 className="text-2xl font-bold tracking-tight mb-3">
              Friendly Environment
            </h3>
            <p className="text-gray-600 leading-relaxed hover:text-gray-400 text-base">
              Step into a warm, welcoming space where you can relax, unwind, and enjoy your time. Our team is dedicated to making every client feel comfortable and valued from the moment they walk through the door.
            </p>
          </div>

          <div className="p-8 border-gray-200 rounded-md bg-white bg-white hover:bg-black hover:text-white transition-colors">
            <h3 className="text-2xl font-bold tracking-tight mb-3">
              Style For All
            </h3>
            <p className="text-gray-600 leading-relaxed hover:text-gray-400 text-base">
              From classic, timeless cuts to modern, bold transformations, we offer a wide range of services for all ages and genders. Whatever your style or hair type, our expert barbers and stylists have you covered.
            </p>
          </div>

          </div>
        </section>

        </main>
    </div>
  );
}