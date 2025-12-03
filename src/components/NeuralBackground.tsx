// src/components/NeuralBackground.tsx
"use client";

// این کامپوننت از JavaScript استفاده نمی‌کند و کاملاً مبتنی بر CSS است
// که باعث می‌شود بار پردازشی CPU موبایل حذف شود.

export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-20">
      
      {/* 1. Global Dark Overlay (پس زمینه اصلی) */}
      <div className="absolute inset-0 bg-slate-950 opacity-90"></div>
      
      {/* 2. Top-Left Blue Glow (نورپردازی آرام) */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-screen opacity-10 blur-3xl lg:w-[600px] lg:h-[600px]"></div>
      
      {/* 3. Bottom-Right Purple Glow (نورپردازی آرام) */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-screen opacity-10 blur-3xl lg:w-[700px] lg:h-[700px]"></div>
      
      {/* 4. Fine Grid/Dot Pattern (شبیه‌سازی شبکه با گرادینت CSS) */}
      {/* این افکت بسیار سبک‌تر از Canvas متحرک است */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:25px_25px]"></div>
      
    </div>
  );
}