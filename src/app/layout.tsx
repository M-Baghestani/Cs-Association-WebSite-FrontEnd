// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { Toaster } from "react-hot-toast";
import { Vazirmatn } from "next/font/google";
import NeuralBackground from "../components/NeuralBackground";

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazir.className} bg-gray-900 text-white antialiased min-h-screen flex flex-col`}>  
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />

        {/* 🚨 حذف NeuralBackground */}
        <NeuralBackground />
        <Navbar />
        
        <main className="flex-grow flex flex-col pt-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        <Footer />
        <BackButton />
      </body>
    </html>
  );
}