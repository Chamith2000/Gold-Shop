import React, { useState } from "react";
import { Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/layout/Logo";

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isRegister) {
        await register({ fullName, email, password, phone });
      } else {
        await login({ email, password });
      }
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async (adminEmail = "admin@gayangoldhouse.lk") => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login({ email: adminEmail, password: "AdminGold2026!" });
      onSuccess();
    } catch {
      // Retry with alternative password
      try {
        await login({ email: adminEmail, password: "admin123" });
        onSuccess();
      } catch (err: any) {
        setErrorMessage(err.message || "Admin login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = (role: "ADMIN" | "CUSTOMER") => {
    if (role === "ADMIN") {
      setEmail("admin@gayangoldhouse.lk");
      setPassword("AdminGold2026!");
      setIsRegister(false);
    } else {
      setEmail("customer@gayangold.com");
      setPassword("gold123");
      setIsRegister(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20 flex items-center justify-center"
    >
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="md" theme="dark" showText={false} />
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-[#5A0F1B]">
              {isRegister ? "Register Royal Patronage" : "Patron & Executive Sign In"}
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Access your sovereign loyalty points, daily lucky spins, or boutique admin control.
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-cinzel transition-all ${
                !isRegister ? "bg-[#5A0F1B] text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-cinzel transition-all ${
                isRegister ? "bg-[#5A0F1B] text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              New Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  key="fullNameField"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Full Legal Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required={isRegister}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Lady Chamari Perera"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.lk or admin@gayangoldhouse.lk"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  key="phoneField"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block font-semibold text-stone-700 mb-1">Mobile Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5A0F1B] hover:bg-[#400A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              id="auth-submit-btn"
            >
              {isLoading ? "Authenticating..." : isRegister ? "Create Sovereign Account" : "Sign In to Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access & Admin 1-Click Login */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block text-center">
              Quick 1-Click Access
            </span>

            {/* Direct 1-Click Admin Access Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickAdminLogin("admin@gayangoldhouse.lk")}
              className="w-full bg-gradient-to-r from-[#5A0F1B] to-[#3B0A11] hover:brightness-110 text-[#F3E5AB] border border-[#D4AF37]/50 py-2.5 px-3 rounded-xl text-xs font-bold font-cinzel flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              id="quick-admin-login-btn"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Instant 1-Click Boutique Admin Login</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill("ADMIN")}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-[#5A0F1B] text-[11px] font-bold py-1.5 rounded-lg border border-amber-200 transition-colors"
              >
                Fill Admin Form
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill("CUSTOMER")}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold py-1.5 rounded-lg border border-stone-200 transition-colors"
              >
                Fill Customer Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
