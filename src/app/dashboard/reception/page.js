"use client";

import { useState, useEffect } from "react";
import {
  Users, Calendar, Plus, Search, CheckCircle2, XCircle,
  Loader2, Clock, Phone, MapPin, RefreshCw, UserPlus, X, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function ReceptionDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("appointments");

  // Book modal state
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bookForm, setBookForm] = useState({ doctorEmail: "", appointmentDate: "" });
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await apiClient("/appointments");
      if (res.code === 200) setAppointments(res.data || []);
      else toast.error(res.message || "Failed to load appointments");
    } catch { toast.error("Failed to fetch appointments"); }
    finally { setLoading(false); }
  };

  const fetchPatients = async () => {
    setPatientsLoading(true);
    try {
      const res = await apiClient("/user/role/USER");
      if (res.code === 200) setPatients(res.data || []);
    } catch { }
    finally { setPatientsLoading(false); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await apiClient("/doctors");
      if (res.code === 200) setDoctors(res.data || []);
    } catch { }
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
    } catch { toast.error("Update failed"); }
  };

  const openBookForPatient = (patient) => {
    setSelectedPatient(patient);
    setBookForm({ doctorEmail: "", appointmentDate: "" });
    setShowBookModal(true);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookForm.doctorEmail || !bookForm.appointmentDate) {
      toast.error("Please fill all fields");
      return;
    }
    setBookLoading(true);
    try {
      const res = await apiClient("/appointments", "POST", {
        doctorEmail: bookForm.doctorEmail,
        appointmentDate: bookForm.appointmentDate,
        patientEmail: selectedPatient.email,
      });
      if (res.code === 201) {
        toast.success(`Appointment booked for ${selectedPatient.name || selectedPatient.email}`);
        setShowBookModal(false);
        fetchAppointments();
      } else {
        toast.error(res.message || "Booking failed");
      }
    } catch { toast.error("Error booking appointment"); }
    finally { setBookLoading(false); }
  };

  const filteredAppointments = appointments.filter(a => {
    const s = searchTerm.toLowerCase();
    return (a.patientEmail?.toLowerCase().includes(s) || a.doctorEmail?.toLowerCase().includes(s));
  });

  const filteredPatients = patients.filter(p => {
    const s = searchTerm.toLowerCase();
    return (p.name?.toLowerCase().includes(s) || p.email?.toLowerCase().includes(s) || p.national_id?.toLowerCase().includes(s));
  });

  const tabs = [
    { id: "appointments", label: "Appointments", count: appointments.length },
    { id: "patients", label: "Patients", count: patients.length },
    { id: "doctors", label: "Doctors", count: doctors.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">Front Desk</h1>
          <p className="text-zinc-500 text-sm sm:text-base">Manage patient bookings and coordinate clinical flow.</p>
        </div>
        <button
          onClick={() => setActiveTab("patients")}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[24px] font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          <UserPlus size={20} /> Book for Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Appts" value={appointments.length} color="blue" />
        <StatCard label="Pending" value={appointments.filter(a => a.status === "PENDING").length} color="amber" />
        <StatCard label="Confirmed" value={appointments.filter(a => a.status === "CONFIRMED").length} color="emerald" />
        <StatCard label="Patients" value={patients.length} color="purple" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-100 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
            className={cn("flex items-center gap-2 px-6 sm:px-8 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap relative",
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-zinc-400 hover:text-zinc-700"
            )}>
            {tab.label}
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black ml-1",
              activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-400"
            )}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm shadow-sm" />
      </div>

      {/* Main Content Area */}
      <div className="glass rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border-white/40 min-h-[400px]">
        {loading || patientsLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-zinc-400 font-medium">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "appointments" && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50/50">
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Patient</th>
                      <th className="hidden sm:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Doctor</th>
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.appointmentId} className="hover:bg-blue-50/10 transition-colors">
                        <td className="px-6 sm:px-8 py-5">
                            <div className="font-bold text-zinc-900 text-sm truncate max-w-[150px]">{apt.patientEmail}</div>
                            <div className="sm:hidden text-[10px] text-zinc-400 mt-0.5 truncate max-w-[150px]">To: {apt.doctorEmail}</div>
                        </td>
                        <td className="hidden sm:table-cell px-8 py-5 text-zinc-500 font-medium text-sm truncate max-w-[200px]">{apt.doctorEmail}</td>
                        <td className="px-6 sm:px-8 py-5 font-bold text-zinc-900 text-sm whitespace-nowrap">{apt.appointmentDate}</td>
                        <td className="px-6 sm:px-8 py-5"><StatusBadge status={apt.status} /></td>
                        <td className="px-6 sm:px-8 py-5 text-right">
                          {apt.status === "PENDING" ? (
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <button onClick={() => handleUpdateStatus(apt.appointmentId, "CONFIRMED")}
                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm" title="Confirm">
                                <CheckCircle2 size={16} />
                              </button>
                              <button onClick={() => handleUpdateStatus(apt.appointmentId, "CANCELLED")}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm" title="Cancel">
                                <XCircle size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-300">#{apt.appointmentId?.slice(0, 8)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}

            {activeTab === "patients" && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50/50">
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Patient</th>
                      <th className="hidden lg:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">National ID</th>
                      <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined</th>
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredPatients.map((p) => (
                      <tr key={p.email} className="hover:bg-blue-50/10 transition-colors">
                        <td className="px-6 sm:px-8 py-5">
                          <div className="font-bold text-zinc-900 text-sm">{p.name || "Patient"}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">{p.email}</div>
                        </td>
                        <td className="hidden lg:table-cell px-8 py-5 text-zinc-500 text-sm font-mono">{p.national_id || "—"}</td>
                        <td className="hidden md:table-cell px-8 py-5 text-zinc-400 text-xs">{p.joinDate || "—"}</td>
                        <td className="px-6 sm:px-8 py-5 text-right">
                          <button
                            onClick={() => openBookForPatient(p)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md"
                          >
                            <Calendar size={13} className="hidden xs:block" /> Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}

            {activeTab === "doctors" && (
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 p-6 sm:p-8">
                  {doctors.filter(d =>
                    d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((doc, i) => (
                    <div key={doc.email || i} className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-lg flex-shrink-0">
                          {doc.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate text-sm">{doc.specialization || "Doctor"}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{doc.email}</div>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-zinc-400 mb-4 h-12 overflow-hidden">
                        {doc.hospital && <div className="flex items-center gap-2 truncate"><MapPin size={12} /><span className="truncate">{doc.hospital}</span></div>}
                        {doc.phone && <div className="flex items-center gap-2"><Phone size={12} /><span>{doc.phone}</span></div>}
                      </div>
                      <button onClick={() => setActiveTab("patients")}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                        Book for Patient
                      </button>
                    </div>
                  ))}
                </div>
            )}

            {!loading && filteredAppointments.length === 0 && activeTab === "appointments" && (
                <div className="py-20 text-center text-zinc-400 text-sm">No appointments matching your criteria.</div>
            )}
            {!patientsLoading && filteredPatients.length === 0 && activeTab === "patients" && (
                <div className="py-20 text-center text-zinc-400 text-sm">No patients found.</div>
            )}
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookModal && selectedPatient && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-6 sm:p-8 relative"
            >
              <button onClick={() => setShowBookModal(false)} className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-all">
                <X size={20} />
              </button>

              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Book Slot</h2>
                <div className="mt-4 p-4 bg-purple-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
                    {(selectedPatient.name || selectedPatient.email)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900 text-sm truncate">{selectedPatient.name || "Patient"}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{selectedPatient.email}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Doctor</label>
                  <select
                    value={bookForm.doctorEmail}
                    onChange={(e) => setBookForm({ ...bookForm, doctorEmail: e.target.value })}
                    required
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-xs appearance-none"
                  >
                    <option value="">Choose doctor...</option>
                    {doctors.map(d => (
                      <option key={d.email} value={d.email}>
                        {d.specialization && `${d.specialization} - `}{d.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookForm.appointmentDate}
                    onChange={(e) => setBookForm({ ...bookForm, appointmentDate: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <button type="submit" disabled={bookLoading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-4 h-14">
                  {bookLoading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={18} /> Confirm</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100"
  };
  return (
    <div className={cn("p-6 sm:p-7 rounded-[28px] border shadow-sm flex flex-col items-center justify-center text-center", themes[color])}>
      <div className="text-2xl sm:text-3xl font-black mb-1">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</div>
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
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border whitespace-nowrap", 
      styles[status] || "bg-zinc-50 text-zinc-600 border-zinc-100"
    )}>
       {status}
    </div>
  );
}
