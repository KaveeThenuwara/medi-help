"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Calendar, Plus, Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Appointments");

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Admin Control</h1>
          <p className="text-zinc-500">Manage your medical network and oversee operations.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-md text-zinc-600 rounded-2xl font-bold hover:bg-white transition-all border border-white/40 shadow-sm">
             <Users size={18} />
             Users
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
             <Plus size={18} />
             Add Doctor
           </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-zinc-100 mb-8 overflow-x-auto scrollbar-hide">
        {["Appointments", "Doctors", "Users", "Analytics"].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={cn(
               "px-8 py-4 text-sm font-bold transition-all relative",
               activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-zinc-400 hover:text-zinc-600"
             )}
           >
             {tab}
           </button>
        ))}
      </div>

      <div className="glass rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] border-white/40">
        <div className="p-8 border-b border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/30 backdrop-blur-xl">
           <div className="relative w-full sm:w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
             <input 
               type="text" 
               placeholder={`Search ${activeTab.toLowerCase()}...`}
               className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none"
             />
           </div>
           <div className="flex items-center gap-2">
              <button className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-900">
                <Filter size={18} />
              </button>
              <button className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-900">
                 <MoreVertical size={18} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "Appointments" && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/30">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Patient</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Doctor</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Date & Time</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Status</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                <AdminRow patient="John Doe" doctor="Dr. Sarah Johnson" date="Oct 24, 2024" time="10:00 AM" status="Confirmed" />
                <AdminRow patient="Alice Smith" doctor="Dr. Michael Chen" date="Oct 24, 2024" time="02:30 PM" status="Pending" />
                <AdminRow patient="Robert Brown" doctor="Dr. Emily Wilson" date="Oct 25, 2024" time="09:15 AM" status="Cancelled" />
                <AdminRow patient="Jessica Lee" doctor="Dr. Sarah Johnson" date="Oct 25, 2024" time="11:45 AM" status="Confirmed" />
              </tbody>
            </table>
          )}
          {activeTab !== "Appointments" && (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
               <div className="w-20 h-20 bg-zinc-50 rounded-[24px] flex items-center justify-center text-zinc-200">
                 <Calendar size={40} />
               </div>
               <p className="text-zinc-500 font-medium">This section is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminRow({ patient, doctor, date, time, status }) {
  return (
    <tr className="hover:bg-zinc-50/50 transition-colors group">
      <td className="px-8 py-6 font-bold text-zinc-900">{patient}</td>
      <td className="px-8 py-6 text-zinc-500 font-medium">{doctor}</td>
      <td className="px-8 py-6">
        <div className="font-bold text-zinc-900">{date}</div>
        <div className="text-xs text-zinc-400">{time}</div>
      </td>
      <td className="px-8 py-6">
         <div className={cn(
           "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
           status === "Confirmed" ? "bg-emerald-50 text-emerald-600" :
           status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
         )}>
           {status === "Confirmed" && <CheckCircle2 size={12} />}
           {status === "Pending" && <Clock size={12} />}
           {status === "Cancelled" && <XCircle size={12} />}
           {status}
         </div>
      </td>
      <td className="px-8 py-6 text-right">
         <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-tight opacity-0 group-hover:opacity-100">
           Review Details
         </button>
      </td>
    </tr>
  );
}
