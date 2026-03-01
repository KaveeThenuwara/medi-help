"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap, Search, Calendar, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="px-8 py-20 md:py-32 flex flex-col items-center text-center max-w-7xl mx-auto w-full">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-8 max-w-4xl"
        >
          Connecting you with the <span className="text-zinc-400 font-medium">right care</span> at the right time.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl leading-relaxed"
        >
          Book appointments with top-rated doctors, manage your health records, and get instant symptom analysis from our AI.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4"
        >
          <Link 
            href="/doctors" 
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
          >
            Find a Doctor
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-semibold hover:bg-zinc-50 transition-all flex items-center justify-center"
          >
            Join MediHelp
          </Link>
        </motion.div>
      </section>

      <section className="px-8 py-24 bg-blue-50/30 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="text-blue-500" />}
              title="Search Specialists"
              description="Browse through hundreds of certified doctors based on specialty, location, and ratings."
            />
            <FeatureCard 
              icon={<Calendar className="text-purple-500" />}
              title="Easy Booking"
              description="Schedule appointments in seconds. Get instant confirmations and digital reminders."
            />
            <FeatureCard 
              icon={<Shield className="text-emerald-500" />}
              title="Secure Records"
              description="Your health data is encrypted and saved securely. Access your history anytime."
            />
          </div>
        </div>
      </section>

      <section className="px-8 py-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">Expert care at your fingertips.</h2>
            <p className="text-lg text-zinc-500 mb-10 leading-relaxed">
              We bring the hospital experience to your home. From consultation to follow-ups, everything is managed through our intuitive platform.
            </p>
            <div className="space-y-4">
              <CheckItem text="300+ Certified Doctors" />
              <CheckItem text="Instant AI Symptom Analysis" />
              <CheckItem text="24/7 Digital Support" />
            </div>
            <Link 
              href="/appointments" 
              className="mt-12 inline-flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1 hover:gap-3 transition-all"
            >
              Learn more about our services
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="flex-1 w-full bg-zinc-100 rounded-[48px] aspect-square overflow-hidden relative">
             <div className="absolute inset-8 bg-white rounded-[32px] shadow-2xl p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Star size={24} fill="currentColor" />
                    </div>
                    <div className="font-bold text-xl">Top Quality</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">VERIFIED</div>
                </div>
                <div className="space-y-4">
                   <div className="h-4 w-full bg-zinc-100 rounded-full" />
                   <div className="h-4 w-2/3 bg-zinc-100 rounded-full" />
                   <div className="h-4 w-1/2 bg-zinc-100 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-zinc-200" />
                   <div className="flex-1 space-y-1">
                      <div className="h-2 w-24 bg-zinc-200 rounded-full" />
                      <div className="h-2 w-16 bg-zinc-100 rounded-full" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-10 rounded-[32px] glass hover:glass-darker transition-all group border-white/40 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-4">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
        <Zap size={14} fill="currentColor" />
      </div>
      <span className="font-medium text-zinc-900">{text}</span>
    </div>
  );
}
