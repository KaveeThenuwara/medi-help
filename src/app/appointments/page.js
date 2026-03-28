"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ChevronRight, Search, Filter, MoreVertical, XCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let endpoint = "/appointments";
      if (user.role === "USER") {
        endpoint = `/appointments/user/${user.email}`;
      } else if (user.role === "DOCTOR") {
        endpoint = `/appointments/doctor/${user.email}`;
      }
      
      const res = await apiClient(endpoint);
      if (res.code === 200) {
        setAppointments(res.data || []);
      } else {
        toast.error(res.message || "Failed to load appointments");
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return app.status === "PENDING" || app.status === "CONFIRMED";
    if (filter === "Completed") return app.status === "PAID" || app.status === "COMPLETED";
    if (filter === "Cancelled") return app.status === "CANCELLED";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
            {user?.role === "RECEPTION" ? "Front Desk Bookings" : "Appointments"}
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base">
            {user?.role === "RECEPTION" 
              ? "Monitor and coordinate all clinic consultations across the network." 
              : "Keep track of your medical visits and upcoming health milestones."}
          </p>
        </div>
        {user?.role === "USER" && (
          <Link 
            href="/doctors" 
            className="w-full lg:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
          >
            Book New <ChevronRight size={18} />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {["All", "Upcoming", "Completed", "Cancelled"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
               "px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
               filter === tab 
                ? "bg-zinc-900 text-white shadow-lg" 
                : "bg-white border border-zinc-100 text-zinc-500 hover:border-zinc-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.map((app, index) => (
            <motion.div
              key={app.appointmentId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-2xl transition-all border-white/40 shadow-xl"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-blue-600 shadow-inner flex-shrink-0">
                   <Calendar size={24} className="sm:hidden" />
                   <Calendar size={28} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                   <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                     <h3 className="text-lg sm:text-xl font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-none">
                       {user?.role === "USER" ? `Dr. ${app.doctorEmail.split('@')[0]}` : app.patientEmail}
                     </h3>
                     <StatusBadge status={app.status} />
                   </div>
                   <p className="text-xs sm:text-sm font-medium text-zinc-400 mt-1 truncate">
                     {user?.role === "USER" ? "Healthcare Professional" : `Patient Reference: ${app.patientEmail}`}
                   </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-12">
                 <div className="flex gap-8">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Date</div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="text-xs sm:text-sm font-bold">{app.appointmentDate}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Type</div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Clock size={14} className="text-amber-500" />
                        <span className="text-xs sm:text-sm font-bold">Standard</span>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-50 lg:border-l lg:pl-12">
                    <button className="p-3 bg-white/50 border border-white/40 rounded-xl sm:rounded-2xl text-zinc-400 hover:text-zinc-900 transition-colors shadow-sm">
                       <MoreVertical size={20} />
                    </button>
                    <Link href={`/appointments/${app.appointmentId}`} className="flex-1 lg:flex-none text-center px-6 py-3.5 bg-white border border-zinc-100 text-zinc-900 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-zinc-50 transition-all shadow-sm">
                       View Details
                    </Link>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-24 sm:py-32 bg-zinc-50/50 rounded-[32px] sm:rounded-[48px] border-2 border-dashed border-zinc-100 flex flex-col items-center">
           <AlertCircle size={48} className="text-zinc-200 mb-4" />
           <p className="text-zinc-500 font-bold">No records found</p>
           <p className="text-zinc-400 text-sm mt-1">Try changing your filters or checking back later.</p>
           {user?.role === "USER" && (
             <Link href="/doctors" className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                Find a Doctor
             </Link>
           )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    PA_PAID: "bg-blue-50 text-blue-600 border-blue-200",
    PAID: "bg-blue-50 text-blue-600 border-blue-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200"
  };
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-tighter border",
      styles[status] || "bg-zinc-50 text-zinc-500 border-zinc-100"
    )}>
      {status}
    </span>
  );
}
