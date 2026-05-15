"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, CreditCard, ArrowRight, Loader2, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { apiClientWithOuttoken } from "@/service/api";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    national_id: "",
  });

  // Step 1: Validate form and send OTP to email
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClientWithOuttoken("/auth/send-register-code", "POST", { email: formData.email });
      if (res.code === 200) {
        setStep("otp");
        toast.success(`Verification code sent to ${formData.email}`);
      } else {
        toast.error(res.message || "Failed to send code");
      }
    } catch {
      toast.error("Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) document.getElementById(`reg-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`reg-otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      document.getElementById("reg-otp-5")?.focus();
    }
  };

  // Step 2: Verify OTP then register the account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) { toast.error("Enter the full 6-digit code"); return; }
    setLoading(true);
    try {
      // Verify the code first
      const verifyRes = await apiClientWithOuttoken("/auth/verify-register-code", "POST", {
        email: formData.email,
        code: fullCode
      });

      if (verifyRes.code !== 200) {
        toast.error(verifyRes.message || "Invalid code");
        setCode(["", "", "", "", "", ""]);
        document.getElementById("reg-otp-0")?.focus();
        setLoading(false);
        return;
      }

      // Code verified — register the account
      const registerRes = await apiClientWithOuttoken("/user/register", "POST", {
        ...formData,
        role: "USER",
        verified: true
      });

      if (registerRes.code === 201) {
        toast.success("Account created! Welcome to MediHelp 🎉");
        login(registerRes.data);
      } else {
        toast.error(registerRes.message || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await apiClientWithOuttoken("/auth/send-register-code", "POST", { email: formData.email });
      toast.success("New code sent!");
      setCode(["", "", "", "", "", ""]);
      document.getElementById("reg-otp-0")?.focus();
    } catch {
      toast.error("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = "text", placeholder, icon) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300">{icon}</div>
        <input
          type={type} required
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg glass p-10 rounded-[40px] shadow-2xl border-white/40"
          >
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl">⚕</div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Create Account</h1>
              <p className="text-zinc-500 text-sm">Join MediHelp to manage your healthcare</p>
            </div>

            <form onSubmit={handleRequestCode} className="space-y-5">
              {field("Full Name", "name", "text", "John Doe", <User size={18} />)}
              {field("Email Address", "email", "email", "name@email.com", <Mail size={18} />)}
              {field("National ID", "national_id", "text", "200012345678", <CreditCard size={18} />)}
              {field("Password", "password", "password", "Min. 6 characters", <Lock size={18} />)}

              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-lg shadow-blue-100 mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <> Send Verification Code <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-zinc-400">Already have an account? </span>
              <Link href="/login" className="font-bold text-zinc-900 hover:underline">Sign In</Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl border-white/40"
          >
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">Verify Your Email</h1>
              <p className="text-zinc-500 text-sm">We sent a 6-digit code to</p>
              <p className="font-bold text-zinc-800 text-sm mt-1">{formData.email}</p>
            </div>

            <form onSubmit={handleVerifyAndRegister} className="space-y-8">
              <div onPaste={handleOtpPaste} className="flex gap-2 justify-center">
                {code.map((digit, i) => (
                  <input
                    key={i} id={`reg-otp-${i}`}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-12 h-14 text-center text-2xl font-black bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit" disabled={loading || code.join("").length < 6}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-100"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Verify & Create Account</>}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-3 text-sm">
              <button onClick={handleResend} disabled={loading} className="flex items-center gap-2 text-zinc-400 font-bold hover:text-blue-600 transition-colors disabled:opacity-50">
                <RefreshCw size={14} /> Resend Code
              </button>
              <button onClick={() => { setStep("form"); setCode(["", "", "", "", "", ""]); }} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                ← Edit details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}