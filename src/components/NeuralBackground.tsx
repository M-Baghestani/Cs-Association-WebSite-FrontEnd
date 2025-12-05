"use client";
import { useEffect, useRef } from "react";

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;

    // تعداد نقاط کمتر روی موبایل
    const pointCount = isMobile ? 25 : 50;

    const points = Array.from({ length: pointCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const update = () => {
      ctx.fillStyle = "#0f172a"; // پس‌زمینه تیره
      ctx.fillRect(0, 0, width, height);

      points.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // نقاط شبکه
        ctx.fillStyle = "rgba(139,92,246,0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // خطوط اتصال محدود شده برای کاهش پردازش
        for (let j = idx + 1; j < points.length; j++) {
          const other = points[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = dx * dx + dy * dy;
          if (dist < 12000) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 12000) * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(update);
    };

    update();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
