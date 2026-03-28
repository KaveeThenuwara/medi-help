"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Clock, MapPin, ArrowRight, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/service/api";
import Link from "next/link";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await apiClient("/doctors");
      if (res.code === 200) {
        setDoctors(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Build specialty list dynamically from real data
  const specialties = ["All", ...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filteredDoctors = doctors.filter(doc =>
    (selectedSpecialty === "All" || doc.specialization === selectedSpecialty) &&
    (doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.hospital?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Find a Specialist</h1>
          <p className="text-zinc-500">Book an appointment with our certified medical professionals.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Specialty filter pills - built from real data */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
        {specialties.map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
              selectedSpecialty === spec
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "bg-white border border-zinc-100 text-zinc-600 hover:border-blue-200 hover:text-blue-600"
            )}
          >
            {spec}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doc, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                key={doc.email}
                className="group glass rounded-[32px] p-6 hover:shadow-2xl hover:glass-darker transition-all overflow-hidden border-white/40 shadow-xl"
              >
                {/* Avatar placeholder */}
                <div className="relative h-48 w-full bg-gradient-to-br from-blue-50 to-zinc-100 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-600 font-black text-4xl border-4 border-blue-50">
                    {doc.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    Verified
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{doc.email}</h3>
                    <p className="text-sm font-bold text-blue-500">{doc.specialization || "General Practice"}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {doc.hospital && (
                      <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <MapPin size={14} className="text-zinc-300 flex-shrink-0" />
                        <span className="truncate">{doc.hospital}</span>
                      </div>
                    )}
                    {doc.phone && (
                      <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Clock size={14} className="text-zinc-300 flex-shrink-0" />
                        <span>{doc.phone}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/appointments/new`}
                    className="w-full mt-4 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Book Appointment
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 rounded-[48px] border-2 border-dashed border-zinc-100">
          <Search size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-500 font-medium">
            {doctors.length === 0
              ? "No doctors registered yet. Ask the admin to add doctors."
              : "No doctors found matching your criteria."}
          </p>
        </div>
      )}
    </div>
  );
}
