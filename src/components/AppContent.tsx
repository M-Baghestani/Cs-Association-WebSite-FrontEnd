// src/components/AppContent.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackButton from "./BackButton";
import NeuralBackground from "./NeuralBackground";

export default function AppContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <NeuralBackground />
      <Navbar />
      <main
        className={`flex flex-col flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        style={{ paddingTop: "4.5rem" }}
      >
        {children}
      </main>
      <Footer />
      <BackButton />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
