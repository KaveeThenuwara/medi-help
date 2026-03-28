"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Stethoscope, Hospital, Phone, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    hospital: "",
    phone: "",
    role: "DOCTOR"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Register User as DOCTOR
      const userRes = await apiClient("/user/register", "POST", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "DOCTOR",
        verified: true
      });

      if (userRes.code === 201) {
        // 2. Save Doctor Details
        const docRes = await apiClient("/doctors", "POST", {
          email: formData.email,
          specialization: formData.specialization,
          hospital: formData.hospital,
          phone: formData.phone
        });

        if (docRes.code === 201 || docRes) { // Handle cases where savedDoctor is returned directly
          toast.success("Doctor added successfully!");
          router.push("/admin");
        } else {
          toast.error("User created but doctor details failed.");
        }
      } else {
        toast.error(userRes.message || "Failed to create user account.");
      }
    } catch (error) {
      toast.error("An error occurred. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => router.back()} className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Add New Doctor</h1>
          <p className="text-zinc-500 text-sm">Create a professional profile for a new medical practitioner.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <User size={14} /> Personal Account
          </h3>
          <div className="space-y-4">
             <FormInput label="Full Name" placeholder="Dr. Jane Smith" value={formData.name} onChange={v => setFormData({...formData, name: v})} icon={<User size={18} />} />
             <FormInput label="Email Address" type="email" placeholder="jane@hospital.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} icon={<Mail size={18} />} />
             <FormInput label="Temporary Password" type="password" placeholder="••••••••" value={formData.password} onChange={v => setFormData({...formData, password: v})} icon={<Lock size={18} />} />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Stethoscope size={14} /> Professional Info
          </h3>
          <div className="space-y-4">
             <FormInput label="Specialization" placeholder="Cardiology, Neurology, etc." value={formData.specialization} onChange={v => setFormData({...formData, specialization: v})} icon={<Stethoscope size={18} />} />
             <FormInput label="Hospital" placeholder="City Medical Center" value={formData.hospital} onChange={v => setFormData({...formData, hospital: v})} icon={<Hospital size={18} />} />
             <FormInput label="Phone Number" placeholder="+94 77 123 4567" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} icon={<Phone size={18} />} />
          </div>
        </div>

        <div className="md:col-span-2 pt-8">
           <button 
             disabled={loading}
             className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
           >
             {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> Register Doctor</>}
           </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, type = "text", placeholder, value, onChange, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300">{icon}</div>
        <input 
          type={type} 
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
