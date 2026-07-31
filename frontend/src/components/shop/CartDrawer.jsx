'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  // Checkout Step Control: 'FORM' | 'GATEWAY_LOGIN' | 'OTP_VERIFY' | 'SUCCESS'
  const [checkoutStep, setCheckoutStep] = useState('FORM');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'COD',
  });

  // Simulated Gateway Credentials State
  const [gatewayAuth, setGatewayAuth] = useState({
    gatewayId: '',
    mpin: '',
  });

  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCartOpen) return null;

  // Reset modal state when closed
  const handleCloseModal = () => {
    setShowCheckoutModal(false);
    setCheckoutStep('FORM');
    setOtpCode('');
    setGatewayAuth({ gatewayId: '', mpin: '' });
  };

  // Step 1 Submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'COD') {
      submitOrderToBackend('PENDING');
    } else {
      // Pre-fill gateway ID with phone number if available
      setGatewayAuth((prev) => ({ ...prev, gatewayId: formData.customerPhone }));
      setCheckoutStep('GATEWAY_LOGIN');
    }
  };

  // Step 2 Submission (Gateway Login)
  const handleGatewayLogin = (e) => {
    e.preventDefault();
    if (!gatewayAuth.gatewayId || !gatewayAuth.mpin) {
      alert('Please enter your payment credentials.');
      return;
    }
    setCheckoutStep('OTP_VERIFY');
  };

  // Step 3 Submission (OTP Verification & Order Placement)
  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      alert('Please enter a valid OTP code.');
      return;
    }
    submitOrderToBackend('PAID');
  };

  // Final API call to Backend
  const submitOrderToBackend = async (paymentStatus) => {
    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        paymentMethod: formData.paymentMethod,
        paymentStatus,
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setCheckoutStep('SUCCESS');
      clearCart();
    } catch (err) {
      alert(`Error placing order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* --- CART DRAWER --- */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-300">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Your Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-800 hover:text-black font-bold text-2xl p-1"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-700 font-medium text-base">
                Your shopping cart is currently empty.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b border-gray-200 pb-4"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-base text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm font-semibold text-gray-700">
                      Rs. {item.price} each
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="px-2.5 py-0.5 border border-gray-400 rounded text-xs font-bold text-gray-900 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="px-2.5 py-0.5 border border-gray-400 rounded text-xs font-bold text-gray-900 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-gray-900">
                      Rs. {item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline mt-2 block"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-bold text-gray-800">Subtotal:</span>
              <span className="text-2xl font-bold text-gray-900">
                Rs. {cartTotal}
              </span>
            </div>
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full bg-black text-white py-3.5 text-base font-bold rounded-md hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* --- CHECKOUT MODAL --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-2xl border border-gray-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-800 hover:text-black font-bold text-xl"
            >
              ✕
            </button>

            {/* STEP 1: DELIVERY INFO FORM */}
            {checkoutStep === 'FORM' && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Delivery Details
                </h3>
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Please enter your contact and shipping information.
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:border-black placeholder-gray-500"
                    placeholder="e.g. Sagar Saru"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:border-black placeholder-gray-500"
                    placeholder="e.g. 9800000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={formData.customerAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, customerAddress: e.target.value })
                    }
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:border-black placeholder-gray-500"
                    placeholder="e.g. Traffic Chowk, Butwal"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-bold text-gray-900 focus:outline-none focus:border-black bg-white"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="eSewa">eSewa Mobile Wallet</option>
                    <option value="Khalti">Khalti Digital Wallet</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-700 block uppercase">
                      Total Due
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      Rs. {cartTotal}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-800 disabled:bg-gray-400 transition"
                  >
                    {loading
                      ? 'Processing...'
                      : formData.paymentMethod === 'COD'
                      ? 'Place Order'
                      : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: GATEWAY LOGIN SCREEN (eSewa / Khalti) */}
            {checkoutStep === 'GATEWAY_LOGIN' && (
              <form onSubmit={handleGatewayLogin} className="space-y-4">
                <div
                  className={`p-4 rounded-md text-white font-bold flex items-center justify-between mb-4 ${
                    formData.paymentMethod === 'eSewa' ? 'bg-[#60BB46]' : 'bg-[#5C2D91]'
                  }`}
                >
                  <span className="text-xl tracking-wide uppercase">
                    {formData.paymentMethod} Express
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded uppercase">
                    Secure Gateway
                  </span>
                </div>

                <div className="bg-gray-100 p-3 rounded text-xs font-semibold text-gray-800 mb-2">
                  Merchant: <strong className="text-black">Mamey's Hair Studio</strong> <br />
                  Amount: <strong className="text-black">Rs. {cartTotal}</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    {formData.paymentMethod} ID / Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={gatewayAuth.gatewayId}
                    onChange={(e) =>
                      setGatewayAuth({ ...gatewayAuth, gatewayId: e.target.value })
                    }
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-bold text-gray-900 focus:outline-none focus:border-black"
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Password / MPIN
                  </label>
                  <input
                    type="password"
                    required
                    value={gatewayAuth.mpin}
                    onChange={(e) =>
                      setGatewayAuth({ ...gatewayAuth, mpin: e.target.value })
                    }
                    className="w-full border border-gray-400 p-2.5 rounded text-sm font-bold text-gray-900 focus:outline-none focus:border-black"
                    placeholder="••••"
                  />
                </div>

                <div className="pt-4 border-t border-gray-300 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('FORM')}
                    className="text-xs font-bold text-gray-700 hover:text-black underline"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-md font-bold text-sm text-white transition ${
                      formData.paymentMethod === 'eSewa'
                        ? 'bg-[#60BB46] hover:bg-[#4ea037]'
                        : 'bg-[#5C2D91] hover:bg-[#482274]'
                    }`}
                  >
                    Send SMS OTP
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SMS OTP VERIFICATION SCREEN */}
            {checkoutStep === 'OTP_VERIFY' && (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                    💬
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">SMS Verification</h3>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    Enter the 6-digit verification code sent to{' '}
                    <span className="font-bold text-black">{gatewayAuth.gatewayId}</span>
                  </p>
                </div>

                <div className="my-6">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold border border-gray-400 p-3 rounded focus:outline-none focus:border-black text-gray-900"
                    placeholder="123456"
                  />
                  <p className="text-[11px] text-gray-600 text-center mt-2 font-medium">
                    (Testing Tip: Enter any 6-digit number, e.g., <strong className="text-black">123456</strong>)
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-300 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('GATEWAY_LOGIN')}
                    className="text-xs font-bold text-gray-700 hover:text-black underline"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-800 disabled:bg-gray-400 transition"
                  >
                    {loading ? 'Confirming...' : `Pay Rs. ${cartTotal}`}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: ORDER CONFIRMED SCREEN */}
            {checkoutStep === 'SUCCESS' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Confirmed!
                </h3>
                <p className="text-sm font-semibold text-gray-800 mb-6">
                  Thank you, <strong className="text-black">{formData.customerName}</strong>! Your order has been registered in our system and stock has been reserved.
                </p>
                <button
                  onClick={() => {
                    handleCloseModal();
                    setIsCartOpen(false);
                  }}
                  className="bg-black text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition"
                >
                  Return to Shop
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}