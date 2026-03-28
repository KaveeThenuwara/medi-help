"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2, XCircle, Loader2, Bell, Search, Activity, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await apiClient(`/appointments/doctor/${user.email}`);
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

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await apiClient(`/appointments/${id}/status?status=${status}`, "PUT");
      if (res.code === 200) {
        toast.success(`Appointment ${status.toLowerCase()}`);
        fetchAppointments();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const filteredAppointments = appointments.filter(a =>
    a.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Welcome, Dr. {user?.email?.split('@')[0]}
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base">
            You have {appointments.filter(a => a.status === 'PENDING').length} pending consultations today.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest border border-blue-100">
             <Stethoscope size={16} /> Verified Practitioner
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
         {/* Stats Panel */}
         <div className="lg:col-span-1 glass p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-white/40 shadow-xl space-y-6 self-start">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
               <Activity size={18} className="text-blue-500" /> Today's Overview
            </h3>
            <div className="space-y-3">
               <OverviewItem label="Total Consults" value={appointments.length} color="zinc" />
               <OverviewItem label="Pending Requests" value={appointments.filter(a => a.status === 'PENDING').length} color="amber" />
               <OverviewItem label="Confirmed" value={appointments.filter(a => a.status === 'CONFIRMED').length} color="emerald" />
               <OverviewItem label="Completed/Paid" value={appointments.filter(a => a.status === 'PAID' || a.status === 'COMPLETED').length} color="blue" />
            </div>
         </div>

         {/* Appointments List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Patient Requests</h2>
              <div className="relative w-full sm:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search patient..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                 />
              </div>
            </div>

            <div className="space-y-4">
               {loading ? (
                 <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <p className="text-zinc-400 text-sm font-medium">Fetching patients...</p>
                 </div>
               ) : filteredAppointments.length > 0 ? (
                 <AnimatePresence mode="popLayout">
                    {filteredAppointments.map((apt) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={apt.appointmentId} 
                        className="p-5 sm:p-6 bg-white border border-zinc-100 rounded-[28px] sm:rounded-[32px] shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center font-bold text-blue-600 text-lg flex-shrink-0">
                             {apt.patientEmail?.charAt(0).toUpperCase()}
                           </div>
                           <div className="min-w-0">
                             <div className="font-bold text-zinc-900 truncate">{apt.patientEmail}</div>
                             <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                <Calendar size={12}/> {new Date(apt.appointmentDate).toLocaleDateString()}
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0">
                            {apt.status === "PENDING" ? (
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button 
                                  onClick={() => handleUpdateStatus(apt.appointmentId, "CONFIRMED")}
                                  className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(apt.appointmentId, "CANCELLED")}
                                  className="flex-1 sm:flex-none px-6 py-2.5 bg-zinc-50 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-all border border-zinc-100"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <div className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                apt.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                apt.status === "PAID" || apt.status === "COMPLETED" ? "bg-blue-50 text-blue-600 border-blue-100" : 
                                "bg-red-50 text-red-600 border-red-100"
                              )}>
                                {apt.status}
                              </div>
                            )}
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
               ) : (
                 <div className="py-20 text-center flex flex-col items-center gap-4 bg-zinc-50/50 rounded-[32px] border-2 border-dashed border-zinc-100">
                    <Calendar size={48} className="text-zinc-200" />
                    <p className="text-zinc-400 font-medium italic">No appointments found.</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

function OverviewItem({ label, value, color }) {
  const colors = {
    zinc: "text-zinc-900 bg-white",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50"
  };
  
  return (
    <div className={cn("flex justify-between items-center p-4 rounded-2xl shadow-sm border border-zinc-50", colors[color])}>
      <span className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
      <span className="text-xl font-black">{value}</span>
    </div>
  );
}
