"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { apiClientWithOuttoken } from "@/service/api";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClientWithOuttoken("/auth/authenticate", "POST", { email, password });
      if (res.code === 201) {
        login(res.data);
        toast.success("Login successful! Welcome back.");
      } else {
        toast.error(res.message || "Invalid email or password");
      }
    } catch {
      toast.error("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl border-white/40"
      >
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl">⚕</div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h1>
          <p className="text-zinc-500 text-sm">Sign in to your MediHelp account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-lg shadow-blue-100 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <> Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-400">Don't have an account? </span>
          <Link href="/register" className="font-bold text-zinc-900 hover:underline">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
