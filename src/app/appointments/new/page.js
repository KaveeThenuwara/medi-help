"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2, ArrowRight, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/service/api";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AppointmentBookingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorEmail: "",
    appointmentDate: "",
    patientEmail: "",
  });

  useEffect(() => {
    fetchDoctors();
    if (user && user.role === "USER") {
      setFormData(prev => ({ ...prev, patientEmail: user.email }));
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const res = await apiClient("/doctors");
      if (res.code === 200) setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await apiClient("/appointments", "POST", formData);
      if (res.code === 201) {
        setStep(3);
      } else {
        toast.error(res.message || "Booking failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 -z-10" />
        <StepIcon num={1} active={step >= 1} current={step === 1} label="Selection" />
        <StepIcon num={2} active={step >= 2} current={step === 2} label="Details" />
        <StepIcon num={3} active={step >= 3} current={step === 3} label="Confirm" />
      </div>

      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-2xl p-10 overflow-hidden">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900">Select Doctor & Date</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Select Doctor</label>
                <select 
                  value={formData.doctorEmail}
                  onChange={(e) => setFormData({ ...formData, doctorEmail: e.target.value })}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(d => (
                    <option key={d.email} value={d.email}>{d.specialization} - {d.email}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Select Date</label>
                <input 
                  type="date" 
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!formData.doctorEmail || !formData.appointmentDate}
              className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
            >
              Continue to Details <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900">Patient Information</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Patient Email</label>
                <input 
                  type="email" 
                  placeholder="patient@example.com"
                  readOnly={user?.role === "USER"}
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-70" 
                />
                {user?.role === "RECEPTION" && <p className="text-xs text-zinc-400">Enter the email of the registered patient.</p>}
              </div>
            </div>
            <button 
              onClick={handleBooking} 
              disabled={loading || !formData.patientEmail}
              className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Book Appointment <CheckCircle2 size={18} /></>}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Go Back</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Success!</h2>
            <p className="text-zinc-500 mb-12">Your appointment request for <span className="text-zinc-900 font-bold">{formData.appointmentDate}</span> has been sent successfully.</p>
            <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="inline-block px-12 py-5 bg-blue-600 text-white rounded-[24px] font-bold shadow-xl shadow-blue-100">
               Go to Dashboard
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StepIcon({ num, active, current, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all",
        current ? "bg-blue-600 text-white ring-8 ring-blue-50" : active ? "bg-blue-600 text-white" : "bg-white border border-zinc-100 text-zinc-400"
      )}>
        {active && !current && num < 3 ? <CheckCircle2 size={20} /> : num}
      </div>
      <span className={cn("text-xs font-bold uppercase tracking-wider", current ? "text-blue-600" : "text-zinc-400")}>{label}</span>
    </div>
  );
}
