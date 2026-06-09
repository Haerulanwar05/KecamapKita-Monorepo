"use client";
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

export default function AdventureTab({ isActive }: { isActive: boolean }) {
  const { currentUser, guestHistory } = useAppStore();
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');

  if (!isActive) return null;

  const isGuest = !currentUser;
  const historyCount = isGuest ? guestHistory.length : (currentUser?.history.length || 0);
  const totalXp = historyCount * 150;
  
  let rankEmoji = "🥚";
  let rankTitle = "Pendatang Baru";
  let rankLevel = 1;
  let progressPct = 0;
  let nextXp = 150;

  if (totalXp >= 150 && totalXp < 300) { rankEmoji = "🐣"; rankTitle = "Langkah Pertama"; rankLevel = 2; progressPct = (totalXp/300)*100; nextXp = 300;}
  else if (totalXp >= 300 && totalXp < 600) { rankEmoji = "🚶🏽‍♂️"; rankTitle = "Penjelajah Santai"; rankLevel = 3; progressPct = (totalXp/600)*100; nextXp = 600;}
  else if (totalXp >= 600 && totalXp < 1200) { rankEmoji = "🎯"; rankTitle = "Pencari Harmoni"; rankLevel = 4; progressPct = (totalXp/1200)*100; nextXp = 1200;}
  else if (totalXp >= 1200) { rankEmoji = "👑"; rankTitle = "Kecamap Overlord"; rankLevel = 5; progressPct = 100; nextXp = totalXp;}

  return (
    <section className="flex-col flex-grow p-6 space-y-6 flex">
        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 dark:border-zinc-800/80 rounded-3xl text-white shadow-xl">
            <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl">
                <i className="fa-solid fa-gamepad"></i>
            </div>
            
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest text-premium-400">Peringkat Eksplorasi</span>
                <div className="flex items-center space-x-1 bg-premium-900/40 border border-premium-500/30 px-2 py-0.5 rounded-md text-[9px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${isGuest ? 'bg-zinc-500' : 'bg-premium-500 animate-pulse'}`}></span>
                    <span className={`font-bold ${isGuest ? 'text-zinc-400' : 'text-premium-400'}`}>
                        {isGuest ? 'LOKAL (LURING)' : 'AWAN SINKRON'}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-3">
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl border border-zinc-700 flex items-center justify-center text-3xl shadow-inner relative">
                    {rankEmoji}
                </div>
                <div>
                    <h2 className="text-lg font-extrabold tracking-tight leading-none">{rankTitle}</h2>
                    <p className="text-[10px] text-zinc-400 mt-1">Level {rankLevel}</p>
                </div>
            </div>

            <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                    <span>XP: {totalXp} / {nextXp}</span>
                    <span>{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-premium-500 to-emerald-400 rounded-full transition-premium shadow-[0_0_8px_#0f9f59]" style={{ width: `${progressPct}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-zinc-800/80 text-center relative z-10">
                <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Kunjungan</span>
                    <p className="text-xs font-bold mt-0.5 text-zinc-100">{historyCount}</p>
                </div>
                <div className="border-x border-zinc-800/80">
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Distrik</span>
                    <p className="text-xs font-bold mt-0.5 text-zinc-100">0</p>
                </div>
                <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Total XP</span>
                    <p className="text-xs font-bold mt-0.5 text-premium-400">{totalXp}</p>
                </div>
            </div>
        </div>

        {isGuest && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between transition-premium">
            <div className="space-y-0.5">
                <p className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Amankan Perjalananmu!</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400 max-w-[210px] leading-relaxed">Anda bermain sebagai Tamu. Buat akun gratis untuk mengunci XP & lencana Anda di awan.</p>
            </div>
            <button className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[9px] font-extrabold shadow-sm transition-premium">Daftar</button>
        </div>
        )}

        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Tempat yang Dikunjungi</h3>
                <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-200/20">
                    {['all', 'week', 'month'].map(t => (
                        <button key={t} onClick={() => setActiveTimeFilter(t)} className={`px-2.5 py-1 rounded-lg text-[9px] transition-premium ${activeTimeFilter === t ? 'font-bold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                            {t === 'all' ? 'Semua' : t === 'week' ? 'Minggu ini' : 'Bulan ini'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20">
                    <i className="fa-solid fa-shoe-prints text-zinc-300 dark:text-zinc-700 text-lg mb-2 block animate-bounce"></i>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Belum ada jejak</span>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1">Belum ada tempat dikunjungi dalam rentang waktu ini.</p>
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">Lencana Pencapaian</h3>
            <div className="grid grid-cols-2 gap-3 font-sans">
                {/* Lencana rendering akan bergantung ke data state juga */}
            </div>
        </div>
    </section>
  );
}
