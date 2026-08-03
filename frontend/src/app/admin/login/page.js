"use client";

import { useState } from "react";
import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        setTimeout(() => {
            if (formData.password.length < 6) {
                setErrorMessage("Invalid credentials or unauthorized role assignment.");
                setIsLoading(false);
                return;
            }

            console.log("Authenticated Admin:", formData);
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-100/80 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

            {/* Background Ambient Orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-48 -translate-y-36 w-96 h-96 bg-amber-200/70 rounded-full blur-3xl pointer-events-none animate-glow-slow" />
            <div className="absolute bottom-1/3 right-1/2 translate-x-48 translate-y-32 w-80 h-80 bg-rose-200/70 rounded-full blur-3xl pointer-events-none animate-glow-delayed" />

            {/* Main Container */}
            <div className="w-full max-w-md space-y-6 relative z-10">

                {/* Brand & Header */}
                <div className="text-center space-y-2">

                    {/* --- LIQUID GLASS LOGO BADGE --- */}
                    <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/45 backdrop-blur-md border border-white/80 text-black mb-2 shadow-sm overflow-hidden">
                        {/* Specular edge highlight on logo */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
                        <ShieldCheck className="w-7 h-7 text-black relative z-10" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                        Mamey's Admin
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Authorized management portal for Salon & Academy
                    </p>
                </div>

                {/* --- LIQUID GLASS CARD --- 
                    Change bg-white/45 below to bg-white/25 for more transparency 
                    or bg-white/70 for more opacity 
                */}
                <div className="relative overflow-hidden bg-white/45 backdrop-blur-xl backdrop-saturate-150 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

                    {/* Specular Liquid Edge Highlight */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/60 rounded-full blur-2xl pointer-events-none" />

                    {/* Error Alert Box */}
                    {errorMessage && (
                        <div className="mb-5 p-3.5 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 text-xs sm:text-sm animate-fade-up">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">

                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@mameys.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-md border border-white/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white/80 focus:ring-2 focus:ring-black focus:border-transparent transition shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white/50 backdrop-blur-md border border-white/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white/80 focus:ring-2 focus:ring-black focus:border-transparent transition shadow-inner"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me Option */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="text-xs text-gray-600 select-none">Remember session</span>
                            </label>

                            <span className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer transition font-medium">
                                Need access?
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <span>Authenticating...</span>
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

            </div>
        </div>
    );
}