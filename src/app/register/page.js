"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { apiClientWithOuttoken, registerUser } from "@/service/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const [loading, setLoading] = useState(false);
 const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    nationalId: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

  console.log("Registering user:", user); // Debug log

  const userData = {
      uid:"",
      email:user.email,
      name:user.name,
      password:user.password,
      role:"User",
      nationalId:user.nationalId,
      verified:true,
      verificationCode: 1234,
      joinDate:""
  }
  const response = await apiClientWithOuttoken("/user/register", "POST", userData);  
  if (response.code !== 201){
    toast.error(response.message || "Registration failed. Please try again.");
  }
    else {
    toast.success("Registration successful! Please log in.");
    setUser({
      name: "",
      email: "",
      password: "",
      nationalId: "",
    });
    setTimeout(() => {
          router.push("/login");

    }, 2000);
  }

};

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-12">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass p-10 rounded-[40px] shadow-2xl border-white/40"
      >

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Create Account
          </h1>
          <p className="text-zinc-500">
            Join MediHelp to manage your health better
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 ml-1">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />

              <input
                type="text"
                required
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 ml-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />

              <input
                type="email"
                required
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                placeholder="name@email.com"
              />
            </div>
          </div>

          {/* NATIONAL ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 ml-1">
              National ID
            </label>

            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />

              <input
                type="text"
                required
                value={user.nationalId}
                onChange={(e) =>
                  setUser({ ...user, nationalId: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                placeholder="200012345678"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 ml-1">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />

              <input
                type="password"
                required
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-center gap-2 ml-1">
            <input
              type="checkbox"
              required
              className="w-4 h-4 rounded border-zinc-200 accent-blue-600"
              id="terms"
            />

            <label htmlFor="terms" className="text-xs text-zinc-500">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-lg shadow-blue-100"
          >

            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}

          </button>

        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-400">
            Already have an account?
          </span>

          <Link
            href="/login"
            className="font-bold text-zinc-900 hover:underline ml-1"
          >
            Sign In
          </Link>
        </div>

      </motion.div>

    </div>
  );
}