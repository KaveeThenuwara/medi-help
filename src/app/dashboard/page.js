"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Bell, ChevronRight, Activity, Loader2, CreditCard, CheckCircle2, Plus, Search, User, Stethoscope, Phone, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [searchDoc, setSearchDoc] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) fetchAppointments();
    fetchDoctors();
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await apiClient(`/appointments/user/${user.email}`);
      if (res.code === 200) setAppointments(res.data || []);
      else toast.error(res.message || "Failed to load appointments");
    } catch { toast.error("Failed to load appointments"); }
    finally { setLoading(false); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await apiClient("/doctors");
      if (res.code === 200) setDoctors(res.data || []);
    } catch { } finally { setDoctorsLoading(false); }
  };

  const handlePay = (appointmentId) => router.push(`/payment?id=${appointmentId}`);

  const filteredDoctors = doctors.filter(d => {
    const s = searchDoc.toLowerCase();
    return d.email?.toLowerCase().includes(s) || 
           d.specialization?.toLowerCase().includes(s) || 
           d.hospital?.toLowerCase().includes(s);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
             Hello, {user?.name?.split(' ')[0] || user?.email?.split("@")[0]} 👋
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base">Welcome back to your health companion.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-colors relative group">
            <Bell size={20} />
            {appointments.some(a => a.status === "PENDING") && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
            )}
          </button>
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-100">
            {(user?.name || user?.email)?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <StatCard icon={<Calendar className="text-blue-500" />} label="Bookings" value={appointments.length} color="blue" />
        <StatCard icon={<CheckCircle2 className="text-emerald-500" />} label="Confirmed" value={appointments.filter(a => a.status === "CONFIRMED").length} color="emerald" />
        <StatCard icon={<Clock className="text-amber-500" />} label="Pending" value={appointments.filter(a => a.status === "PENDING").length} color="amber" />
        <StatCard icon={<Activity className="text-purple-500" />} label="Paid" value={appointments.filter(a => a.status === "PAID").length} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Appointments Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">My Appointments</h2>
            <Link href="/appointments/new" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
              <Plus size={16} /> <span className="hidden xs:block">Book New</span>
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                 <Loader2 className="animate-spin text-blue-600" size={32} />
                 <p className="text-zinc-400 text-sm font-medium">Updating list...</p>
              </div>
            ) : appointments.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {appointments.map(apt => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={apt.appointmentId} 
                    className="p-5 sm:p-6 bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {apt.doctorEmail?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-900 text-sm truncate max-w-[150px] sm:max-w-none">{apt.doctorEmail}</div>
                        <div className="text-[10px] sm:text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                           <Calendar size={12}/> {new Date(apt.appointmentDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-50">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                        apt.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        apt.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        apt.status === "PAID" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-600 border-red-100"
                      )}>{apt.status}</span>
                      
                      {apt.status === "CONFIRMED" && (
                        <button onClick={() => handlePay(apt.appointmentId)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">
                          <CreditCard size={14} /> Pay Now
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="p-12 text-center bg-zinc-50/50 rounded-[32px] border-2 border-dashed border-zinc-100 flex flex-col items-center">
                <Calendar size={48} className="text-zinc-200 mb-4" />
                <p className="text-zinc-500 font-bold mb-1">No appointments yet</p>
                <p className="text-zinc-400 text-sm mb-6">Stay proactive about your health.</p>
                <Link href="/appointments/new" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Book Slot <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Doctors Quick Panel */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-bold text-zinc-900">Explore Doctors</h2>
            <Link href="/doctors" className="text-xs font-bold text-blue-500 hover:underline">See all</Link>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
               type="text" 
               placeholder="Search by specialty, location..." 
               value={searchDoc} 
               onChange={(e) => setSearchDoc(e.target.value)}
               className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-100 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
            {doctorsLoading ? (
              <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={24} /></div>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, i) => (
                <div key={doc.email || i} className="p-4 bg-white rounded-2xl border border-zinc-100 hover:shadow-xl hover:-translate-x-1 transition-all group cursor-pointer"
                  onClick={() => router.push("/appointments/new")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      {doc.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-900 text-sm truncate">{doc.specialization || "Physician"}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{doc.email}</div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-200 ml-auto shrink-0 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                 <Search size={32} className="mx-auto text-zinc-200 mb-2" />
                 <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">No results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = { 
    blue: "bg-blue-50 border-blue-100", 
    emerald: "bg-emerald-50 border-emerald-100", 
    amber: "bg-amber-50 border-amber-100", 
    purple: "bg-purple-50 border-purple-100" 
  };
  return (
    <div className={cn("p-5 sm:p-6 rounded-[28px] border shadow-sm hover:shadow-xl transition-all duration-300", colors[color])}>
      <div className="p-2 bg-white/50 backdrop-blur-sm rounded-xl inline-block mb-4 shadow-sm">{icon}</div>
      <div className="text-2xl sm:text-3xl font-black text-zinc-900">{value}</div>
      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1 opacity-70">{label}</div>
    </div>
  );
}
