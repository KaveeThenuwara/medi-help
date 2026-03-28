"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { apiClient } from "@/service/api";
import { toast } from "react-toastify";

export default function AddReceptionistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "RECEPTION"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient("/user/register", "POST", {
        ...formData,
        verified: true
      });

      if (res.code === 201) {
        toast.success("Receptionist account created!");
        router.push("/admin");
      } else {
        toast.error(res.message || "Failed to create account.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-8 py-12 min-h-screen flex flex-col justify-center">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => router.back()} className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Add Staff Account</h1>
          <p className="text-zinc-500 text-sm">Create a new receptionist account for front-desk operations.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass p-10 rounded-[40px] border-white/40 shadow-2xl space-y-8">
        <div className="space-y-6">
           <FormInput label="Staff Name" placeholder="Receptionist Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} icon={<User size={18} />} />
           <FormInput label="Official Email" type="email" placeholder="staff@medihelp.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} icon={<Mail size={18} />} />
           <FormInput label="Temporary Password" type="password" placeholder="••••••••" value={formData.password} onChange={v => setFormData({...formData, password: v})} icon={<Lock size={18} />} />
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold">
           <ShieldCheck size={18} />
           <span>This account will have RECEPTIONIST level access privileges.</span>
        </div>

        <button 
          disabled={loading}
          className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-bold text-lg shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> Create Staff Account</>}
        </button>
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
