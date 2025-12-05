// src/components/NeuralMatrixBackground.tsx
"use client";

import { useEffect, useRef } from "react";

export default function NeuralMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = { x: 0, y: 0 };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // شبکه عصبی
    const neuralPoints = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    // بارش ماتریکس
    const matrixCols = Math.floor(width / 20);
    const matrixDrops = Array(matrixCols).fill(0);
    const matrixChars = "アカサタナハマヤラワ0123456789@$%&*#";

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const update = () => {
      // پس‌زمینه تیره
      ctx.fillStyle = "#0f172a"; // bg-slate-950
      ctx.fillRect(0, 0, width, height);

      // رنگ مشترک برای شبکه و ماتریکس
      const commonColor = "rgba(139,92,246,0.6)"; // purple-500 با opacity

      // شبکه عصبی
      neuralPoints.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = commonColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        for (let other of neuralPoints) {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = dx * dx + dy * dy;
          if (dist < 13000) {
            const alpha = 1 - dist / 13000;
            ctx.strokeStyle = `rgba(139,92,246,${alpha * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = mdx * mdx + mdy * mdy;
        if (mdist < 50000) {
          p.x += mdx * 0.02;
          p.y += mdy * 0.02;
        }
      });

      // بارش ماتریکس
      ctx.font = "16px monospace";
      for (let i = 0; i < matrixDrops.length; i++) {
        if (Math.random() > 0.98) continue; // کاهش تعداد برای سبک شدن

        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * 20;
        const y = matrixDrops[i] * 20;

        ctx.fillStyle = commonColor;
        ctx.fillText(text, x, y);

        if (matrixDrops[i] * 20 < height) matrixDrops[i] += 0.25; // حرکت آهسته
        else if (Math.random() > 0.975) matrixDrops[i] = 0;
      }

      requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    update();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
