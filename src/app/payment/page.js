"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";

function PaymentContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient("/payments", "POST", {
        appointmentId,
        amount: 2500, // Fixed amount for now
        paymentMethod: "CARD"
      });
      if (res.code === 201) {
        setSuccess(true);
        toast.success("Payment successful!");
        setTimeout(() => router.push("/dashboard"), 3000);
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900">Payment Successful!</h2>
        <p className="text-zinc-500">Redirecting you to the dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-zinc-900">Checkout</h1>
      </div>

      <div className="bg-zinc-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
             <div className="text-sm font-bold uppercase tracking-widest text-white/40">Premium Consultation</div>
             <CreditCard size={24} className="text-white/20" />
          </div>
          <div className="text-4xl font-black">LKR 2,500.00</div>
          <div className="flex gap-4 text-xs font-bold text-white/40">
             <span>ID: {appointmentId?.slice(0, 8)}...</span>
             <span>TAX INCLUDED</span>
          </div>
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Expiry Date</label>
              <input type="text" placeholder="MM/YY" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">CVV</label>
              <input type="text" placeholder="xxx" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono" />
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pay LKR 2,500.00</>}
        </button>
        <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Secure 256-bit SSL Encrypted Payment</p>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12 min-h-screen flex items-center justify-center">
      <Suspense fallback={<Loader2 className="animate-spin text-blue-600" size={40} />}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
