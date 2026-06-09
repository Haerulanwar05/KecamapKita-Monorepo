export default function Toast() {
    return (
        <div id="toast-notification" className="absolute bottom-20 left-6 right-6 bg-zinc-900/95 dark:bg-zinc-50/95 text-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-4 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 transition-premium transform translate-y-20 opacity-0 pointer-events-none z-50 backdrop-blur-md">
            <div id="toast-icon" className="text-premium-400 text-sm">
                <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="flex-grow">
                <p id="toast-message" className="text-[11px] font-semibold leading-relaxed"></p>
            </div>
            <button className="text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-zinc-900 transition-colors">
                <i className="fa-solid fa-xmark text-xs"></i>
            </button>
        </div>
    );
}
