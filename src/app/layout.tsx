import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import NeuralBackground from "../components/NeuralBackground";
import { Toaster } from "react-hot-toast";
import { Vazirmatn } from "next/font/google";

const vazir = Vazirmatn({ 
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "انجمن علمی علوم کامپیوتر",
  description: "وب‌سایت رسمی انجمن علمی",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazir.className} bg-slate-950 text-white antialiased min-h-screen flex flex-col`}>
        {/* ... Toaster و Background ... */}
        <NeuralBackground />
        <Navbar />
        
        {/* 👇 FIX: کاهش فاصله از بالا از pt-32 به pt-24 */}
        <main className="flex-grow flex flex-col pt-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        {/* ... Footer و BackButton ... */}
      </body>
    </html>
  );
}