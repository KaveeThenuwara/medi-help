"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { apiClientWithOuttoken } from "@/service/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // "email" | "otp" | "newpass" | "done"
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClientWithOuttoken("/auth/forgot-password", "POST", { email });
      if (res.code === 200) {
        setStep("otp");
        toast.success("Reset code sent to your email!");
      } else {
        toast.error(res.message || "Email not found");
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
    if (value && index < 5) document.getElementById(`reset-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) { toast.error("Enter the full 6-digit code"); return; }
    setStep("newpass");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match!"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await apiClientWithOuttoken("/auth/reset-password", "POST", {
        email,
        code: code.join(""),
        newPassword
      });
      if (res.code === 200) {
        setStep("done");
      } else {
        toast.error(res.message || "Invalid or expired code");
        setStep("otp");
        setCode(["", "", "", "", "", ""]);
      }
    } catch {
      toast.error("Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.div key="email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl border-white/40">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-500 text-3xl">🔑</div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">Forgot Password?</h1>
              <p className="text-zinc-500 text-sm">Enter your email to receive a reset code.</p>
            </div>
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
                    placeholder="name@example.com" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={18} /> Send Reset Code</>}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">← Back to Login</Link>
            </div>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl border-white/40">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600"><ShieldCheck size={32} /></div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">Enter Reset Code</h1>
              <p className="text-zinc-500 text-sm">Check your email at <strong className="text-zinc-900">{email}</strong></p>
            </div>
            <form onSubmit={handleVerifyCode} className="space-y-8">
              <div className="flex gap-3 justify-center">
                {code.map((digit, i) => (
                  <input key={i} id={`reset-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, i)} onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-12 h-14 text-center text-2xl font-black bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
                ))}
              </div>
              <button type="submit" disabled={code.join("").length < 6} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <ArrowRight size={18} /> Verify Code
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => { setStep("email"); setCode(["", "", "", "", "", ""]); }} className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">← Change Email</button>
            </div>
          </motion.div>
        )}

        {step === "newpass" && (
          <motion.div key="newpass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl border-white/40">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-500"><Lock size={28} /></div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">Create New Password</h1>
              <p className="text-zinc-500 text-sm">Choose a strong password for your account.</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all text-sm"
                    placeholder="At least 6 characters" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all text-sm"
                    placeholder="Repeat your password" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-100">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Update Password</>}
              </button>
            </form>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl border-white/40 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500"><CheckCircle2 size={40} /></div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Password Updated!</h1>
            <p className="text-zinc-500 text-sm mb-10">Your password was successfully reset. You can now log in with your new password.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              Go to Login <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
