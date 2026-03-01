"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const symptomCheck = (input) => {
  const text = input.toLowerCase();
  if (text.includes("fever") && text.includes("cough")) return "You might have a common cold or flu. Please stay hydrated and rest. If symptoms persist, consult a doctor.";
  if (text.includes("headache") && text.includes("nausea")) return "This could be a migraine. Ensure you are in a dark, quiet room. If it's severe, seek medical attention.";
  if (text.includes("stomach") && text.includes("pain")) return "Abdominal pain can be caused by many things. If it's sharp or persistent, please see a specialist.";
  if (text.includes("chest pain") || text.includes("breath")) return "URGENT: Chest pain or difficulty breathing can be serious. Please contact emergency services immediately.";
  return "I'm not exactly sure what that could be. It's best to book an appointment with one of our specialists for an accurate diagnosis.";
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm your MediHelp AI assistant. Tell me your symptoms and I'll try to help." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = symptomCheck(input);
      setMessages(prev => [...prev, { role: "bot", text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-96 max-w-[calc(100vw-2rem)] glass shadow-2xl overflow-hidden flex flex-col h-[500px] border-white/20 rounded-[32px]"
          >
            <div className="p-4 bg-white/50 backdrop-blur-xl flex items-center justify-between border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Medi AI Console</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50"
            >
              {messages.map((m, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex w-full",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed",
                    m.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-zinc-800 border border-zinc-100 shadow-sm rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-100 shadow-sm rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-zinc-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Describe your symptoms..."
                  className="w-full pl-4 pr-12 py-3 bg-zinc-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-zinc-900 shadow-xl flex items-center justify-center text-white hover:bg-zinc-800 transition-all border-4 border-white"
      >
        <MessageSquare size={28} />
      </motion.button>
    </div>
  );
}
