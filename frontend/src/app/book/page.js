import BookingWizard from './BookingWizard';

export default function BookPage() {
  return (
    <div className="w-full bg-white text-black min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* HEADER SECTION */}
        <section className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Reserve Your Session.
          </h1>
          <p className="text-gray-800 text-base md:text-lg font-semibold leading-relaxed">
            Select your service, choose your preferred barber, and pick a time slot that fits your schedule.
          </p>
        </section>

        {/* BOOKING WIZARD */}
        <BookingWizard />
      </main>
    </div>
  );
}