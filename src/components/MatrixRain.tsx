"use client";
import { useEffect, useRef } from "react";

interface MatrixRainProps {
  columns?: number;
  fontSize?: number;
  color?: string;
}

export default function MatrixRain({
  columns = 60,
  fontSize = 14,
  color = "#3b82f680",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colCount = columns;
    const colHeight = Array(colCount).fill(0);

    const chars =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = chars.split("");
    if (window.innerWidth < 768) {
      columns = Math.floor(columns / 2);
      fontSize = Math.min(fontSize, 10);
    }
    const draw = () => {
      ctx.fillStyle = "rgba(15,23,42,0.1)"; // مشابه bg-slate-950 با کمی شفافیت
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < colCount; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, colHeight[i] * fontSize);

        if (colHeight[i] * fontSize > height && Math.random() > 0.975) {
          colHeight[i] = 0;
        }
        colHeight[i]++;
      }

      requestAnimationFrame(draw);
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    draw();
    return () => window.removeEventListener("resize", resize);
  }, [columns, fontSize, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none"
    />
  );
}
