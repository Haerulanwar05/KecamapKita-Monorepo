"use client";
import { useState } from 'react';

export default function AiNeighborTab({ isActive }: { isActive: boolean }) {
  const [messages, setMessages] = useState<{text: string, sender: 'user'|'bot'}[]>([
    { text: "Halo tetangga! Saya **Pak RT**, asisten AI lokalmu. Mau cari seblak tersembunyi yang pedas mantap atau tempat melamun asri di kecamatan sekitar? Tanyain aja langsung di bawah ya!", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput("");
    
    // Fake AI response for now
    setTimeout(() => {
        setMessages(prev => [...prev, { text: "Wah, menarik tuh! Coba nanti Pak RT tanyakan dulu ya sama warga sekitar sini.", sender: 'bot' }]);
    }, 1000);
  };

  if (!isActive) return null;

  return (
    <section className="flex-col flex-grow flex">
        <div className="p-4 px-6 bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-800/40 flex items-center space-x-3.5 transition-colors">
            <div className="relative">
                <div className="w-11 h-11 bg-premium-100 dark:bg-premium-900/30 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                    👨🏽‍🦳
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-premium-500 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse"></span>
            </div>
            <div>
                <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">Pak RT "KecamapKita"</h3>
                <p className="text-[10px] text-premium-600 dark:text-premium-400 font-semibold tracking-wide mt-0.5">Asisten AI Tetangga Anda • Online</p>
            </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-zinc-50/20 dark:bg-zinc-950/5 min-h-[350px]">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'bot' && <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm shrink-0">👨🏽‍🦳</div>}
                    <div className={
                        msg.sender === 'user' 
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3.5 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] text-[12px] leading-relaxed font-medium"
                        : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] text-[12px] text-zinc-600 dark:text-zinc-300 leading-relaxed"
                    }>
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>

        <div className="p-4 px-6 border-t border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 flex items-center space-x-2 transition-colors">
            <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                type="text" 
                placeholder="Tanya tentang spot melamun di Menteng..." 
                className="flex-grow px-4 py-3 bg-zinc-100/70 dark:bg-zinc-800/50 rounded-2xl text-xs text-zinc-800 dark:text-white placeholder-zinc-400 focus:outline-none focus:bg-white focus:dark:bg-zinc-950 focus:ring-1 focus:ring-premium-500 transition-premium" 
            />
            <button onClick={handleSend} className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl flex items-center justify-center transition-premium shadow-md shadow-zinc-900/10 dark:shadow-none">
                <i className="fa-solid fa-arrow-up text-xs"></i>
            </button>
        </div>
    </section>
  );
}
