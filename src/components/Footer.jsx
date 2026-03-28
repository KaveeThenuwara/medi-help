"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-100 mt-24">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold text-zinc-900 tracking-tighter">
              Medi<span className="text-blue-600">Help</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Providing modern, accessible healthcare solutions for everyone. Your health is our priority, and we&apos;re here to help you every step of the way.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink href="/doctors" label="Find Doctors" />
              <FooterLink href="/appointments" label="Book Appointment" />
              <FooterLink href="/dashboard" label="User Dashboard" />
              <FooterLink href="/login" label="Login / Register" />
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Services</h4>
            <ul className="space-y-4">
              <FooterLink href="#" label="Symptom Analysis" />
              <FooterLink href="#" label="Online Consultation" />
              <FooterLink href="#" label="Medical Records" />
              <FooterLink href="#" label="Health Plans" />
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-500 text-sm">
                <Mail size={16} className="text-blue-600" />
                KVSH@gmail.com
              </li>
              <li className="flex items-center gap-3 text-zinc-500 text-sm">
                <Phone size={16} className="text-blue-600" />
                +94 76 809 6682
              </li>
              <li className="flex items-start gap-3 text-zinc-500 text-sm">
                <MapPin size={16} className="text-blue-600 shrink-0" />
                Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-400 text-xs">
            © 2024 MediHelp. Created by <span className="text-zinc-900 font-bold">KVSH</span>. Built with <Heart size={10} className="inline text-red-500" fill="currentColor" /> for your health.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors font-medium">Privacy Policy</Link>
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors font-medium">Terms of Service</Link>
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors font-medium">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <li>
      <Link href={href} className="text-sm text-zinc-500 hover:text-blue-600 transition-colors font-medium">
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white transition-all">
      {icon}
    </button>
  );
}
