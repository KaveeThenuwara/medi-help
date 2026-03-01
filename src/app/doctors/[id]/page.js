"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, ShieldCheck, Mail, Phone, Calendar, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DoctorProfilePage({ params }) {
  const unresolvedParams = use(params);
  const id = unresolvedParams.id;

  // Mock data for the specific doctor
  const doctor = {
    id,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 120,
    location: "New York Medical Center, NY",
    about: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. She specialized in preventive cardiology and heart failure management.",
    education: [
      "Medical Degree - Harvard Medical School",
      "Residency - Mayo Clinic",
      "Fellowship - Johns Hopkins Hospital"
    ],
    experience: "15+ Years",
    availability: "Available Tomorrow",
    price: "$150"
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <Link href="/doctors" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-12 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to search
      </Link>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-12">
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 bg-zinc-100 rounded-[40px] flex items-center justify-center text-zinc-300">
               <ShieldCheck size={80} />
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <h1 className="text-4xl font-bold text-zinc-900">{doctor.name}</h1>
                 <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">Featured</div>
               </div>
               <p className="text-xl font-medium text-zinc-500">{doctor.specialty}</p>
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-1.5">
                   <Star size={18} className="text-yellow-500" fill="currentColor" />
                   <span className="font-bold text-zinc-900">{doctor.rating}</span>
                   <span className="text-zinc-400">({doctor.reviews} Reviews)</span>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                 <div className="flex items-center gap-1.5 text-zinc-500">
                   <Clock size={18} />
                   <span>{doctor.experience} Exp</span>
                 </div>
               </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900">About Doctor</h2>
            <p className="text-zinc-500 leading-relaxed text-lg">{doctor.about}</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900">Education & Training</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctor.education.map((edu, i) => (
                <div key={i} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-zinc-300" />
                  <span className="text-sm font-medium text-zinc-600">{edu}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900">Location</h2>
            <div className="h-64 bg-zinc-100 rounded-[32px] overflow-hidden flex items-center justify-center text-zinc-400 flex-col gap-4">
               <MapPin size={48} />
               <p className="font-medium">{doctor.location}</p>
            </div>
          </section>
        </div>

        <aside className="w-full lg:w-96">
          <div className="bg-white rounded-[40px] border border-zinc-100 shadow-2xl p-8 sticky top-32">
             <div className="flex justify-between items-center mb-8">
               <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Consultation Fee</div>
               <div className="text-3xl font-bold text-zinc-900">{doctor.price}</div>
             </div>

             <div className="space-y-4 mb-8">
               <div className="p-4 bg-zinc-50 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Calendar size={20} className="text-zinc-400" />
                   <div className="text-sm font-semibold">Tomorrow</div>
                 </div>
                 <div className="text-xs font-bold text-emerald-600">Available</div>
               </div>
               <div className="p-4 bg-zinc-50 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Clock size={20} className="text-zinc-400" />
                   <div className="text-sm font-semibold">09:00 AM - 05:00 PM</div>
                 </div>
               </div>
             </div>

             <button 
                onClick={() => window.location.href = `/appointments/new?doctor=${id}`}
                className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group mb-4"
             >
                Book Appointment
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>

             <p className="text-center text-xs text-zinc-400 px-4">
               You won't be charged yet. Payments are handled after the consultation.
             </p>

             <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-center gap-6">
                <button className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                  <Mail size={20} />
                </button>
                <button className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                   <ShieldCheck size={20} />
                </button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
