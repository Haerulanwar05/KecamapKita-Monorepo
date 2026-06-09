import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KecamapKita - Eksplorasi Premium Kecamatan",
  description: "A micro-community tourism application featuring weather-adaptive algorithms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans min-h-screen flex items-center justify-center transition-colors duration-500 py-0 md:py-10">
        <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 md:rounded-[40px] md:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] dark:md:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] md:border md:border-zinc-100 dark:md:border-zinc-800/60 overflow-hidden min-h-screen md:min-h-[840px] flex flex-col pb-20 transition-all duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}
