import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediHelp | Modern Medical Care",
  description: "Your health, our priority. Book appointments and manage your health with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar />
          <main className="min-h-screen pt-24">
            {children}
          </main>
          <ChatBot />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
