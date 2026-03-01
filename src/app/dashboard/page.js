"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, Bell, Search, Settings, ChevronRight, Activity, Heart, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Hello, John Doe</h1>
          <p className="text-zinc-500">Welcome back to your health dashboard.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors relative">
             <Bell size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
           <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <StatCard icon={<Heart className="text-pink-500" />} label="Avg. Heart Rate" value="72 bpm" trend="+2% vs last week" />
         <StatCard icon={<Thermometer className="text-orange-500" />} label="Body Temp" value="36.6 °C" trend="Normal" />
         <StatCard icon={<Activity className="text-blue-500" />} label="Steps Today" value="8,432" trend="85% of goal" />
         <StatCard icon={<Clock className="text-purple-500" />} label="Sleeptime" value="7h 20m" trend="-30m vs yesterday" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-zinc-900">Upcoming Appointments</h2>
             <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
           </div>
           
           <div className="space-y-4">
              <AppointmentItem 
                doctor="Dr. Sarah Johnson" 
                specialty="Cardiology" 
                date="Tomorrow, 10:00 AM" 
                status="Confirmed"
              />
              <AppointmentItem 
                doctor="Dr. Michael Chen" 
                specialty="Neurology" 
                date="Mar 15, 02:30 PM" 
                status="Pending"
              />
           </div>

           <div className="glass rounded-[40px] p-8 text-zinc-900 relative overflow-hidden border-white/40 shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold">New: AI Symptom Checker</h3>
                  <p className="text-zinc-500 max-w-sm">Use our new AI tool to quickly analyze your symptoms before booking an appointment.</p>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">Try Now</button>
                </div>
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                   <Activity size={48} className="text-blue-600" />
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h2 className="text-2xl font-bold text-zinc-900">Health History</h2>
           <div className="space-y-6">
              <HistoryItem date="Feb 20, 2024" type="General Checkup" summary="Everything looks great. Keep up the exercise." />
              <HistoryItem date="Jan 12, 2024" type="Blood Test" summary="Vitamins slightly low. Recommended supplements." />
              <HistoryItem date="Dec 05, 2023" type="Dental Cleaning" summary="Next cleaning in 6 months." />
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="glass p-6 rounded-[32px] hover:glass-darker transition-all shadow-xl border-white/40">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/50 rounded-2xl shadow-sm">{icon}</div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{trend}</span>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium text-zinc-400">{label}</div>
        <div className="text-2xl font-bold text-zinc-900">{value}</div>
      </div>
    </div>
  );
}

function AppointmentItem({ doctor, specialty, date, status }) {
  return (
    <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 flex flex-wrap items-center justify-between gap-6 hover:bg-white hover:shadow-xl hover:border-transparent transition-all">
       <div className="flex items-center gap-4">
         <div className="w-14 h-14 bg-zinc-200 rounded-2xl overflow-hidden" />
         <div>
           <div className="font-bold text-zinc-900">{doctor}</div>
           <div className="text-sm text-zinc-400">{specialty}</div>
         </div>
       </div>
       <div className="flex items-center gap-4">
         <div className="text-right">
            <div className="text-sm font-bold text-zinc-900">{date}</div>
            <div className={cn(
              "text-[10px] font-black uppercase tracking-tighter",
              status === "Confirmed" ? "text-emerald-500" : "text-amber-500"
            )}>{status}</div>
         </div>
         <button className="p-2 bg-white rounded-xl text-zinc-400 hover:text-zinc-900 shadow-sm">
           <ChevronRight size={20} />
         </button>
       </div>
    </div>
  );
}

function HistoryItem({ date, type, summary }) {
  return (
    <div className="relative pl-6 border-l-2 border-zinc-100 pb-8 last:pb-0">
       <div className="absolute top-0 -left-1.5 w-3 h-3 bg-zinc-200 rounded-full border-2 border-white" />
       <div className="space-y-1">
         <div className="text-xs font-bold text-zinc-400">{date}</div>
         <div className="font-bold text-zinc-900">{type}</div>
         <p className="text-sm text-zinc-500">{summary}</p>
       </div>
    </div>
  );
}
