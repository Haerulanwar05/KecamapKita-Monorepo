"use client";
import { useAppStore } from '@/store/useAppStore';

export default function ExploreTab({ isActive }: { isActive: boolean }) {
  const { activeVibe, setActiveVibe, activeKecamatan } = useAppStore();

  if (!isActive) return null;

  return (
    <section className="flex flex-col flex-grow">
      <div className="px-6 py-5 space-y-4 bg-gradient-to-b from-zinc-50/50 to-transparent dark:from-zinc-950/20">
        <button className="w-full flex items-center justify-between py-3 px-4 bg-premium-50/70 hover:bg-premium-100/80 dark:bg-premium-900/10 dark:hover:bg-premium-900/20 border border-premium-100/50 dark:border-premium-900/30 text-premium-700 dark:text-premium-400 rounded-2xl text-xs font-semibold transition-premium">
            <span className="flex items-center space-x-2.5">
                <i className="fa-solid fa-location-arrow text-xs animate-pulse text-premium-500"></i>
                <span>Gunakan lokasi saat ini</span>
            </span>
            <i className="fa-solid fa-chevron-right text-[10px] opacity-65"></i>
        </button>
        
        <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 text-xs">
                <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input type="text" placeholder="Cari kecamatan (cth: Ubud, Menteng)..." className="w-full pl-11 pr-10 py-3.5 bg-zinc-100/75 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-0 dark:border-zinc-800/80 rounded-2xl text-xs text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:bg-white focus:dark:bg-zinc-950 focus:ring-1 focus:ring-premium-500 transition-premium shadow-inner-sm" />
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-zinc-400 dark:text-zinc-500 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-premium-500"></span>
            <span>Destinasi di <strong className="text-zinc-700 dark:text-zinc-300 font-bold">Kecamatan {activeKecamatan}</strong></span>
        </div>
      </div>

      <div className="px-6 py-2">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-3">
              {['all', 'syahdu', 'kenyang', 'kreatif', 'sejarah'].map(vibe => (
                <button 
                  key={vibe}
                  onClick={() => setActiveVibe(vibe)} 
                  className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold shadow-sm transition-premium ${activeVibe === vibe ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}>
                    {vibe === 'all' ? '✨ Semua Vibe' : 
                     vibe === 'syahdu' ? '🍃 #Syahdu' :
                     vibe === 'kenyang' ? '🍜 #Kenyang' :
                     vibe === 'kreatif' ? '🎨 #Kreatif' : '🏛️ #Sejarah'}
                </button>
              ))}
          </div>
      </div>

      <div className="p-6 pt-2 space-y-5 flex-grow overflow-y-auto font-sans">
        {/* Placeholder for Spot Cards */}
        <div className="text-center py-16 px-6">
            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800/60 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto mb-4">
                <i className="fa-solid fa-mountain-sun text-xl"></i>
            </div>
            <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">Koneksi API Backend Diperlukan</h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 leading-relaxed">Menunggu koneksi data dari backend spatial.</p>
        </div>
      </div>
    </section>
  );
}
