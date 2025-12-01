"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NeuralBackground() {
  const [mounted, setMounted] = useState(false);

  // مختصات نودها (نورون‌ها) به درصد (تا در هر صفحه‌ای کار کند)
  const nodes = [
    { x: 10, y: 20 }, { x: 30, y: 15 }, { x: 50, y: 30 }, { x: 70, y: 20 }, { x: 90, y: 10 },
    { x: 15, y: 50 }, { x: 35, y: 45 }, { x: 55, y: 60 }, { x: 80, y: 40 }, { x: 95, y: 60 },
    { x: 10, y: 80 }, { x: 40, y: 85 }, { x: 60, y: 75 }, { x: 85, y: 80 }
  ];

  // تعریف اتصالات (کدام نود به کدام وصل شود)
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], // ردیف بالا
    [5, 6], [6, 7], [7, 8], [8, 9], // ردیف وسط
    [10, 11], [11, 12], [12, 13],   // ردیف پایین
    [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], // عمودی‌ها
    [5, 10], [6, 11], [7, 12], [8, 13],
    [1, 5], [2, 6], [3, 9] // مورب‌ها
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-50 bg-slate-950" />;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-950">
      
      {/* 1. لایه هاله رنگی (برای عمق دادن، اما کمرنگ‌تر) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-900/40 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-900/40 blur-[120px]" />
      </div>

      {/* 2. شبکه عصبی (SVG Overlay) */}
      <svg className="absolute inset-0 h-full w-full">
        {/* رسم خطوط (سیناپس‌ها) */}
        {connections.map(([start, end], i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${nodes[start].x}%`}
            y1={`${nodes[start].y}%`}
            x2={`${nodes[end].x}%`}
            y2={`${nodes[end].y}%`}
            stroke="rgba(148, 163, 184, 0.15)" // رنگ خاکستری/آبی خیلی کمرنگ
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.05 }}
          />
        ))}

        {/* رسم نقاط (نورون‌ها) */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3"
            fill="#60a5fa" // آبی روشن
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.5, 1, 0.5],
              boxShadow: "0 0 20px #60a5fa"
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: Math.random() * 2, // تپش تصادفی
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
      
      {/* 3. افکت ذره‌ای ریز (Floating Particles) - گرد و غبار فضایی */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

    </div>
  );
}