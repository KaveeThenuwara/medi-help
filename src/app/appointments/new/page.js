"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppointmentBookingPage() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const handleNext = () => setStep(step + 1);

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 -z-10" />
        <StepIcon num={1} active={step >= 1} current={step === 1} label="Schedule" />
        <StepIcon num={2} active={step >= 2} current={step === 2} label="Details" />
        <StepIcon num={3} active={step >= 3} current={step === 3} label="Confirm" />
      </div>

      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-2xl p-10 overflow-hidden">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900">Choose a date & time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Select Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "p-3 rounded-xl text-sm font-bold transition-all",
                        time === t ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-blue-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={handleNext} 
              disabled={!date || !time}
              className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue to Details <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900">Patient Details</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Symptons/Reason for Visit</label>
                <textarea rows={4} placeholder="Describe your symptoms..." className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none" />
              </div>
            </div>
            <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
              Book Appointment <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Request Sent!</h2>
            <p className="text-zinc-500 mb-12">Waiting for Dr. Sarah Johnson to confirm your appointment on <span className="text-zinc-900 font-bold">{date}</span> at <span className="text-zinc-900 font-bold">{time}</span>.</p>
            <Link href="/dashboard" className="inline-block px-12 py-5 bg-blue-600 text-white rounded-[24px] font-bold shadow-xl shadow-blue-100">
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

import Link from "next/link";
