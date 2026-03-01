"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ChevronRight, Search, Filter, MoreVertical, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const APPOINTMENTS = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Oct 24, 2024", time: "10:00 AM", status: "Upcoming", type: "In-person" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Neurologist", date: "Oct 28, 2024", time: "02:30 PM", status: "Upcoming", type: "Video Call" },
  { id: 3, doctor: "Dr. Emily Wilson", specialty: "Dermatologist", date: "Oct 15, 2024", time: "09:15 AM", status: "Completed", type: "In-person" },
  { id: 4, doctor: "Dr. David Smith", specialty: "Pediatrician", date: "Oct 10, 2024", time: "11:45 AM", status: "Cancelled", type: "In-person" },
];

export default function AppointmentsPage() {
  const [filter, setFilter] = useState("All");

  const filteredAppointments = APPOINTMENTS.filter(app => 
    filter === "All" || app.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">My Appointments</h1>
          <p className="text-zinc-500">Manage your upcoming and past medical consultations.</p>
        </div>
        <Link 
          href="/doctors" 
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
        >
          Book New <ChevronRight size={18} />
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {["All", "Upcoming", "Completed", "Cancelled"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
               "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
               filter === tab 
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
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
              key={app.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-8 rounded-[40px] flex flex-wrap items-center justify-between gap-8 hover:glass-darker transition-all border-white/40 shadow-xl"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
                   <Calendar size={28} />
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                     <h3 className="text-xl font-bold text-zinc-900">{app.doctor}</h3>
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                       app.status === "Upcoming" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                       app.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                       "bg-red-50 text-red-600 border border-red-100"
                     )}>
                       {app.status}
                     </span>
                   </div>
                   <p className="text-sm font-medium text-zinc-400">{app.specialty} • {app.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-zinc-600">
                      <Calendar size={18} className="text-zinc-400" />
                      <span className="text-sm font-bold">{app.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600">
                      <Clock size={18} className="text-zinc-400" />
                      <span className="text-sm font-bold">{app.time}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button className="p-4 bg-white/50 border border-white/40 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-colors shadow-sm">
                       <MoreVertical size={20} />
                    </button>
                    {app.status === "Upcoming" ? (
                      <button className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg">
                         Reschedule
                      </button>
                    ) : (
                      <button className="px-6 py-4 bg-white border border-zinc-100 text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all">
                         View Details
                      </button>
                    )}
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-32 bg-zinc-50/50 rounded-[48px] border-2 border-dashed border-zinc-100">
           <AlertCircle size={48} className="mx-auto text-zinc-200 mb-4" />
           <p className="text-zinc-500 font-medium">No appointments found.</p>
           <Link href="/doctors" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Book your first consultation</Link>
        </div>
      )}
    </div>
  );
}
