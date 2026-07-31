'use client';

import { useState } from 'react';

// Studio Services List
const SERVICES = [
  { id: '1', name: "Signature Haircut & Styling", duration: '45 mins', price: 800, desc: 'Consultation, scalp massage, precision cut, and wash.' },
  { id: '2', name: 'Beard Sculpting & Hot Towel', duration: '30 mins', price: 500, desc: 'Precision line-up, hot towel steam, and organic beard oil finish.' },
  { id: '3', name: 'The Royal Combo (Cut + Beard)', duration: '75 mins', price: 1200, desc: 'Full signature haircut combined with complete beard sculpting.' },
  { id: '4', name: 'Hair Color & Hair Spa', duration: '60 mins', price: 1500, desc: 'Deep conditioning treatment with premium organic hair tint.' },
];

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:30 PM', '02:30 PM', '03:30 PM', 
  '04:30 PM', '05:30 PM', '06:30 PM'
];

export default function BookingWizard() {
  const [step, setStep] = useState(1); // Steps: 1 (Service), 2 (Date & Time), 3 (Details & Payment), 4 (Confirmation)

  // Selection States
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');

  // Customer & Payment States
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('STUDIO'); // 'STUDIO' | 'eSewa' | 'Khalti'
  const [gatewayAuth, setGatewayAuth] = useState({ gatewayId: '', mpin: '' });
  const [otpCode, setOtpCode] = useState('');
  const [paymentSubStep, setPaymentSubStep] = useState('DETAILS'); // 'DETAILS' | 'GATEWAY' | 'OTP'

  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  // Generate next 7 available dates
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  };

  const datesList = getAvailableDates();

  // Submit appointment to Backend API
 // Find this inside handleFinalBooking in BookingWizard.jsx:
const handleFinalBooking = async (paidOnline = false) => {
  setLoading(true);
  try {
    const bookingPayload = {
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      
      // ⬇️ UPDATED FIELD NAMES TO MATCH BACKEND SCHEMA
      service: selectedService.name,          // Changed from serviceName
      servicePrice: selectedService.price,
      appointmentDate: selectedDate,          // Changed from bookingDate
      timeSlot: selectedTime,                 // Changed from bookingTime
      
      paymentMethod: paymentMethod,
      paymentStatus: paidOnline ? 'PAID' : 'PENDING',
    };

    const res = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Booking failed');

    setBookingRef(data.appointment?._id || 'APT-' + Math.floor(100000 + Math.random() * 900000));
    setStep(4); // Move to instant confirmation screen
  } catch (err) {
    alert(`Booking error: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-lg shadow-sm p-6 md:p-10">
      
      {/* --- PROGRESS STEP INDICATOR --- */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          {[
            { num: 1, label: 'Select Service' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Details & Payment' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 md:gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s.num ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs md:text-sm font-bold ${step >= s.num ? 'text-black' : 'text-gray-700'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= STEP 1: SERVICE SELECTION ================= */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
              Select Your Service
            </h2>
            <p className="text-sm font-semibold text-gray-800">
              Choose a haircut or grooming treatment below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((srv) => {
              const isSelected = selectedService.id === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-5 rounded-md border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-black bg-gray-50 ring-1 ring-black'
                      : 'border-gray-300 hover:border-gray-500 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{srv.name}</h3>
                    <span className="font-bold text-gray-900 text-base">Rs. {srv.price}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mb-3">{srv.desc}</p>
                  <span className="text-[11px] font-bold text-gray-900 bg-gray-200 px-2 py-1 rounded">
                    ⏱ {srv.duration}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-black text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition"
            >
              Continue to Date & Time →
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: DATE & TIME SELECTION ================= */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
              Select Date & Time
            </h2>
            <p className="text-sm font-semibold text-gray-800">
              Pick an available day and time slot for your appointment.
            </p>
          </div>

          {/* DATE PICKER */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase mb-2">Choose Date</label>
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.fullDate;
                return (
                  <button
                    key={d.fullDate}
                    onClick={() => setSelectedDate(d.fullDate)}
                    className={`flex-1 min-w-[75px] p-3 rounded-md border text-center transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-black'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase">{d.dayName}</p>
                    <p className="text-xl font-bold">{d.dayNum}</p>
                    <p className="text-[10px] font-semibold uppercase">{d.month}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIME SLOTS */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase mb-2">Choose Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-4 rounded-md border font-bold text-sm transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-black'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-gray-900 font-bold text-sm underline hover:text-black"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (!selectedTime) return alert('Please select a time slot.');
                setStep(3);
              }}
              className="bg-black text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition"
            >
              Continue to Details & Payment →
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: CUSTOMER DETAILS & PAYMENT ================= */}
      {step === 3 && (
        <div className="space-y-6">
          {paymentSubStep === 'DETAILS' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (paymentMethod === 'STUDIO') {
                  handleFinalBooking(false);
                } else {
                  setGatewayAuth({ gatewayId: customer.phone, mpin: '' });
                  setPaymentSubStep('GATEWAY');
                }
              }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
                  Your Information & Payment
                </h2>
                <p className="text-sm font-semibold text-gray-800">
                  Please enter your contact details to reserve your slot.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full border border-gray-400 p-2.5 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:border-black"
                  placeholder="e.g. Sagar Saru"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:border-black"
                    placeholder="e.g. 9800000000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:border-black"
                    placeholder="sagar@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-400 p-2.5 rounded text-sm font-bold text-gray-900 focus:outline-none focus:border-black bg-white"
                >
                  <option value="STUDIO">Pay at Studio after service (Cash / Card)</option>
                  <option value="eSewa">Prepay with eSewa Mobile Wallet</option>
                  <option value="Khalti">Prepay with Khalti Digital Wallet</option>
                </select>
              </div>

              {/* Summary Box */}
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-md space-y-1 text-sm font-semibold text-gray-900 mt-4">
                <p>💈 <strong className="text-black">Service:</strong> {selectedService.name} (Rs. {selectedService.price})</p>
                <p>📅 <strong className="text-black">Date & Time:</strong> {selectedDate} at {selectedTime}</p>
                <p>💳 <strong className="text-black">Payment:</strong> {paymentMethod === 'STUDIO' ? 'Pay at Studio' : `Prepay via ${paymentMethod}`}</p>
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-900 font-bold text-sm underline hover:text-black"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : paymentMethod === 'STUDIO' ? 'Confirm Appointment' : 'Proceed to Prepay'}
                </button>
              </div>
            </form>
          )}

          {/* GATEWAY LOGIN STEP */}
          {paymentSubStep === 'GATEWAY' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPaymentSubStep('OTP');
              }}
              className="space-y-4"
            >
              <div
                className={`p-4 rounded-md text-white font-bold flex items-center justify-between ${
                  paymentMethod === 'eSewa' ? 'bg-[#60BB46]' : 'bg-[#5C2D91]'
                }`}
              >
                <span className="text-xl tracking-wide uppercase">{paymentMethod} Gateway</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Secure Gateway</span>
              </div>

              <p className="text-sm font-semibold text-gray-800">
                Prepaying <strong className="text-black">Rs. {selectedService.price}</strong> for {selectedService.name}.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Mobile / Wallet ID</label>
                <input
                  type="text"
                  required
                  value={gatewayAuth.gatewayId}
                  onChange={(e) => setGatewayAuth({ ...gatewayAuth, gatewayId: e.target.value })}
                  className="w-full border border-gray-400 p-2.5 rounded text-sm font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-1">MPIN / Password</label>
                <input
                  type="password"
                  required
                  value={gatewayAuth.mpin}
                  onChange={(e) => setGatewayAuth({ ...gatewayAuth, mpin: e.target.value })}
                  className="w-full border border-gray-400 p-2.5 rounded text-sm font-bold text-gray-900"
                  placeholder="••••"
                />
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setPaymentSubStep('DETAILS')}
                  className="text-xs font-bold text-gray-800 underline"
                >
                  ← Change Method
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-md font-bold text-sm text-white ${
                    paymentMethod === 'eSewa' ? 'bg-[#60BB46]' : 'bg-[#5C2D91]'
                  }`}
                >
                  Send OTP Code
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFICATION STEP */}
          {paymentSubStep === 'OTP' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFinalBooking(true);
              }}
              className="space-y-4 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900">Enter SMS Code</h3>
              <p className="text-xs font-semibold text-gray-800">
                Verification code sent to <strong className="text-black">{gatewayAuth.gatewayId}</strong>
              </p>

              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-2xl font-bold border border-gray-400 p-3 rounded focus:outline-none focus:border-black text-gray-900 my-4"
                placeholder="123456"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition"
              >
                {loading ? 'Confirming...' : `Pay Rs. ${selectedService.price} & Complete Booking`}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ================= STEP 4: INSTANT CONFIRMATION ================= */}
      {step === 4 && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Appointment Confirmed!</h2>
          <p className="text-base font-semibold text-gray-800 max-w-md mx-auto">
            Thank you, <strong className="text-black">{customer.name}</strong>. Your session is reserved in our system.
          </p>

          <div className="bg-gray-50 border border-gray-300 p-6 rounded-md max-w-sm mx-auto text-left space-y-2 text-sm font-semibold text-gray-900">
            <p><span className="text-gray-700 font-bold uppercase text-xs block">Booking Reference</span> {bookingRef}</p>
            <p><span className="text-gray-700 font-bold uppercase text-xs block">Service</span> {selectedService.name}</p>
            <p><span className="text-gray-700 font-bold uppercase text-xs block">Date & Time</span> {selectedDate} at {selectedTime}</p>
            <p><span className="text-gray-700 font-bold uppercase text-xs block">Payment Option</span> {paymentMethod === 'STUDIO' ? 'Pay at Studio (Pending)' : `Paid Online via ${paymentMethod}`}</p>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setSelectedTime('');
              setPaymentSubStep('DETAILS');
            }}
            className="bg-black text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition"
          >
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  );
}