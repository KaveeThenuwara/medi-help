"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Calendar, Plus, Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock, Trash2, Edit, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Appointments");
  const [summary, setSummary] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchSummary();
    fetchData();
  }, [activeTab]);

  const fetchSummary = async () => {
    try {
      const res = await apiClient("/admin/reports/summary");
      if (res.code === 200) {
        setSummary(res.data);
      } else {
        toast.error(res.message || "Failed to load summary");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "Appointments") endpoint = "/appointments";
      else if (activeTab === "Doctors") endpoint = "/user/role/DOCTOR";
      else if (activeTab === "Users") endpoint = "/user/role/USER";
      else if (activeTab === "Reception") endpoint = "/user/role/RECEPTION";

      if (endpoint) {
        const res = await apiClient(endpoint);
        if (res.code === 200) {
          setData(res.data || []);
        } else {
          setData([]);
          toast.error(res.message || `Failed to fetch ${activeTab}`);
        }
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await apiClient(`/user/delete/${email}`, "DELETE");
      if (res.code === 200) {
        toast.success("User deleted successfully");
        fetchData();
        fetchSummary();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await apiClient(`/appointments/${id}/status?status=${status}`, "PUT");
      if (res.code === 200) {
        toast.success("Status updated");
        fetchData();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase();
    if (activeTab === "Appointments") {
      return (item.patientEmail?.toLowerCase().includes(search) || 
              item.doctorEmail?.toLowerCase().includes(search));
    }
    return (item.name?.toLowerCase().includes(search) || 
            item.email?.toLowerCase().includes(search));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">Admin Control</h1>
          <p className="text-zinc-500 text-sm sm:text-base">Manage your medical network and oversee operations.</p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
          <StatCard label="Doctors" value={summary?.doctorCount || 0} icon={<Users size={16} />} color="blue" />
          <StatCard label="Patients" value={summary?.patientCount || 0} icon={<Users size={16} />} color="emerald" />
          <StatCard label="Staff" value={summary?.receptionistCount || 0} icon={<Users size={16} />} color="amber" />
          <StatCard label="Appointments" value={summary?.totalAppointments || 0} icon={<Calendar size={16} />} color="purple" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-100 mb-8 overflow-x-auto scrollbar-hide">
        {["Appointments", "Doctors", "Reception", "Users", "Analytics"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 sm:px-8 py-4 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap",
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="glass rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] border-white/40">
        <div className="p-6 sm:p-8 border-b border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/30 backdrop-blur-xl">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             {activeTab === "Doctors" && (
               <Link href="/admin/doctors/add" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-sm">
                 <Plus size={18} /> Add Doctor
               </Link>
             )}
              {activeTab === "Reception" && (
               <Link href="/admin/reception/add" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-sm">
                 <Plus size={18} /> Add Staff
               </Link>
             )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Clock className="animate-spin text-blue-600" size={40} />
                <p className="text-zinc-400 font-medium animate-pulse">Loading {activeTab}...</p>
             </div>
          ) : filteredData.length > 0 ? (
            <div className="min-w-full inline-block align-middle">
              {activeTab === "Appointments" ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50/30">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Patient</th>
                      <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Doctor</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredData.map((apt) => (
                      <tr key={apt.appointmentId} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-8 py-6">
                            <div className="font-bold text-zinc-900 text-sm">{apt.patientEmail}</div>
                            <div className="md:hidden text-xs text-zinc-400 mt-0.5">To: {apt.doctorEmail}</div>
                        </td>
                        <td className="hidden md:table-cell px-8 py-6 text-zinc-500 font-medium text-sm">{apt.doctorEmail}</td>
                        <td className="px-8 py-6">
                            <div className="font-bold text-zinc-900 text-sm">{apt.appointmentDate}</div>
                        </td>
                        <td className="px-8 py-6">
                           <StatusBadge status={apt.status} />
                        </td>
                        <td className="px-8 py-6 text-right">
                           {apt.status === "PENDING" && (
                             <div className="flex items-center justify-end gap-1">
                               <button onClick={() => handleUpdateStatus(apt.appointmentId, "CONFIRMED")} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="Confirm"><CheckCircle2 size={18} /></button>
                               <button onClick={() => handleUpdateStatus(apt.appointmentId, "CANCELLED")} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Cancel"><XCircle size={18} /></button>
                             </div>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : ["Doctors", "Reception", "Users"].includes(activeTab) ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50/30">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Profile</th>
                      <th className="hidden lg:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">ID Details</th>
                      <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredData.map((u) => (
                      <tr key={u.uid} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-8 py-6">
                            <div className="font-bold text-zinc-900 text-sm">{u.name || "Unnamed User"}</div>
                            <div className="text-xs text-zinc-400 mt-0.5">{u.email}</div>
                        </td>
                        <td className="hidden lg:table-cell px-8 py-6">
                            <div className="text-zinc-500 font-medium text-sm">{u.national_id || "N/A"}</div>
                        </td>
                        <td className="hidden md:table-cell px-8 py-6">
                            <div className="text-zinc-400 text-xs">{u.joinDate ? new Date(u.joinDate).toLocaleDateString() : "N/A"}</div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-1">
                               <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Edit"><Edit size={18} /></button>
                               <button onClick={() => handleDeleteUser(u.email)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete"><Trash2 size={18} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                   <div className="w-20 h-20 bg-zinc-50 rounded-[24px] flex items-center justify-center text-zinc-200">
                     <Calendar size={40} />
                   </div>
                   <p className="text-zinc-500 font-medium">Analytics reports coming soon.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                <Search size={48} className="text-zinc-100" />
                <div>
                   <p className="text-zinc-900 font-bold text-lg">No {activeTab.toLowerCase()} found</p>
                   <p className="text-zinc-400 text-sm">Try adjusting your search or filters.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const themes = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600"
  };
  
  return (
    <div className="p-5 sm:p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={cn("p-3 rounded-2xl flex-shrink-0", themes[color])}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{label}</div>
        <div className="text-xl sm:text-2xl font-black text-zinc-900">{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
    PAID: "bg-blue-50 text-blue-600 border-blue-100"
  };
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border", 
      styles[status] || "bg-zinc-50 text-zinc-600 border-zinc-100"
    )}>
       {status}
    </div>
  );
}
