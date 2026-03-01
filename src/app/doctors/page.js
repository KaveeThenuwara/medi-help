"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, Clock, MapPin, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCTORS = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.9, reviews: 120, location: "New York, USA", image: "/doc1.jpg", price: "$150" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Neurologist", rating: 4.8, reviews: 95, location: "San Francisco, USA", image: "/doc2.jpg", price: "$200" },
  { id: 3, name: "Dr. Emily Brown", specialty: "Dermatologist", rating: 4.7, reviews: 150, location: "Chicago, USA", image: "/doc3.jpg", price: "$120" },
  { id: 4, name: "Dr. David Wilson", specialty: "Pediatrician", rating: 4.9, reviews: 210, location: "Austin, USA", image: "/doc4.jpg", price: "$100" },
  { id: 5, name: "Dr. James Miller", specialty: "Orthopedic", rating: 4.6, reviews: 88, location: "Seattle, USA", image: "/doc5.jpg", price: "$180" },
  { id: 6, name: "Dr. Linda Garcia", specialty: "Psychiatrist", rating: 4.9, reviews: 130, location: "Miami, USA", image: "/doc6.jpg", price: "$160" },
];

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const specialties = ["All", "Cardiologist", "Neurologist", "Dermatologist", "Pediatrician", "Orthopedic", "Psychiatrist"];

  const filteredDoctors = DOCTORS.filter(doc => 
    (selectedSpecialty === "All" || doc.specialty === selectedSpecialty) &&
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Find a Specialist</h1>
          <p className="text-zinc-500">Book an appointment with our world-class medical professionals.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-sm"
            />
          </div>
          <div className="relative flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
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
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDoctors.map((doc, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              key={doc.id}
              className="group glass rounded-[32px] p-6 hover:shadow-2xl hover:glass-darker transition-all overflow-hidden border-white/40 shadow-xl"
            >
              <div className="relative h-64 w-full bg-zinc-100 rounded-2xl mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                  <User size={64} />
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-zinc-900 border border-white/20">
                  {doc.price} / consultation
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{doc.name}</h3>
                    <p className="text-sm font-medium text-zinc-400">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-full">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span className="text-sm font-bold text-zinc-900">{doc.rating}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <MapPin size={16} />
                    {doc.location}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Clock size={16} />
                    Mon - Fri, 09:00 - 17:00
                  </div>
                </div>

                <button 
                   onClick={() => window.location.href = `/doctors/${doc.id}`}
                   className="w-full mt-4 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                   View Profile
                   <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 rounded-[48px] border-2 border-dashed border-zinc-100">
           <Search size={48} className="mx-auto text-zinc-200 mb-4" />
           <p className="text-zinc-500 font-medium">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
