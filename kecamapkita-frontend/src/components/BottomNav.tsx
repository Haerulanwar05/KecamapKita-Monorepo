"use client";
import { useAppStore } from '@/store/useAppStore';

export default function BottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) {
  const { currentUser, guestHistory } = useAppStore();
  // Using simplified logic for now, in a real scenario we'd check if any level up happened
  
  return (
    <nav className="bg-white/90 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800/40 absolute bottom-0 left-0 right-0 z-40 transition-colors backdrop-blur-md">
      <div className="flex justify-around items-center py-3">
        <button onClick={() => setActiveTab('explore')} className={`flex flex-col items-center space-y-1 transition-premium ${activeTab === 'explore' ? 'text-premium-600 dark:text-premium-400 font-bold' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}>
          <i className="fa-solid fa-compass text-base"></i>
          <span className="text-[9px] tracking-wide mt-0.5">Eksplorasi</span>
        </button>
        <button onClick={() => setActiveTab('adventure')} className={`relative flex flex-col items-center space-y-1 transition-premium ${activeTab === 'adventure' ? 'text-premium-600 dark:text-premium-400 font-bold' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}>
          <i className="fa-solid fa-award text-base"></i>
          <span className="text-[9px] tracking-wide mt-0.5">Petualangan</span>
        </button>
        <button onClick={() => setActiveTab('ai-neighbor')} className={`flex flex-col items-center space-y-1 transition-premium ${activeTab === 'ai-neighbor' ? 'text-premium-600 dark:text-premium-400 font-bold' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}>
          <i className="fa-solid fa-comment-dots text-base"></i>
          <span className="text-[9px] tracking-wide mt-0.5">Tanya Tetangga</span>
        </button>
      </div>
    </nav>
  );
}
