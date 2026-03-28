"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Search, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { apiClient } from "@/service/api";

export default function Home() {
  const [stats, setStats] = useState({ doctorCount: 0, patientCount: 0, totalAppointments: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient("/admin/reports/summary");
        if (res.code === 200) setStats(res.data);
      } catch {
        // If not authenticated, stats remain at 0
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-8 py-20 md:py-32 flex flex-col items-center text-center max-w-7xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-8 max-w-4xl"
        >
          Connecting you with the <span className="text-zinc-400 font-medium">right care</span> at the right time.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl leading-relaxed"
        >
          Book appointments with certified doctors, manage your health records, and access seamless healthcare from anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4"
        >
          <Link
            href="/doctors"
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
          >
            Find a Doctor
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-semibold hover:bg-zinc-50 transition-all flex items-center justify-center"
          >
            Join MediHelp
          </Link>
        </motion.div>
      </section>

      {/* Live Stats */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <LiveStat label="Verified Doctors" value={statsLoading ? null : stats.doctorCount} suffix="+" />
            <LiveStat label="Registered Patients" value={statsLoading ? null : stats.patientCount} suffix="+" />
            <LiveStat label="Appointments Booked" value={statsLoading ? null : stats.totalAppointments} suffix="" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24 bg-blue-50/30 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="text-blue-500" />}
              title="Search Specialists"
              description="Browse through certified doctors based on specialty, hospital, and contact details."
            />
            <FeatureCard
              icon={<Calendar className="text-purple-500" />}
              title="Easy Booking"
              description="Schedule appointments in seconds. Get instant confirmations and manage your bookings."
            />
            <FeatureCard
              icon={<Shield className="text-emerald-500" />}
              title="Secure & Private"
              description="Your health data is encrypted and saved securely. Access your history anytime."
            />
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="px-8 py-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">Expert care at your fingertips.</h2>
            <p className="text-lg text-zinc-500 mb-10 leading-relaxed">
              We bring the hospital experience to your home. From consultation to follow-ups, everything is managed through our intuitive platform.
            </p>
            <div className="space-y-4">
              <CheckItem text="Certified & Verified Medical Professionals" />
              <CheckItem text="Role-Based Access for Doctors, Staff & Patients" />
              <CheckItem text="Seamless Online & In-Person Booking" />
            </div>
            <Link
              href="/appointments/new"
              className="mt-12 inline-flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1 hover:gap-3 transition-all"
            >
              Book your first appointment
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="flex-1 w-full bg-zinc-100 rounded-[48px] aspect-square overflow-hidden relative">
            <div className="absolute inset-8 bg-white rounded-[32px] shadow-2xl p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl">
                    M+
                  </div>
                  <div className="font-bold text-xl">MediHelp</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">LIVE</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Doctors</span>
                  <span className="font-black text-zinc-900">{statsLoading ? "—" : stats.doctorCount}</span>
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Patients</span>
                  <span className="font-black text-zinc-900">{statsLoading ? "—" : stats.patientCount}</span>
                </div>
                <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "55%" }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">⚕</div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 w-24 bg-zinc-100 rounded-full" />
                  <div className="h-2 w-16 bg-zinc-50 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LiveStat({ label, value, suffix }) {
  return (
    <div className="text-center p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm">
      <div className="text-4xl font-black text-zinc-900 mb-2">
        {value === null ? <Loader2 className="animate-spin mx-auto text-zinc-300" size={32} /> : `${value}${suffix}`}
      </div>
      <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-10 rounded-[32px] glass hover:glass-darker transition-all group border-white/40 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-4">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
        <Zap size={14} fill="currentColor" />
      </div>
      <span className="font-medium text-zinc-900">{text}</span>
    </div>
  );
}
