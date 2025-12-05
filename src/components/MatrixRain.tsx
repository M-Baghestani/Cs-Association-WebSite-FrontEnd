"use client";
import { useEffect, useRef } from "react";

interface MatrixProps {
  width?: number;
  height?: number;
  columns?: number;
  fontSize?: number;
  speed?: number;
  color?: string; // رنگ ماتریکس
}

export default function MatrixRain({
  width,
  height,
  columns = 30,
  fontSize = 16,
  speed = 2,
  color = "#3b82f6aa", // blue glow مشابه bg سایت
}: MatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = width || window.innerWidth;
    canvas.height = height || window.innerHeight;

    const cols = columns;
    const colHeight = Array(cols).fill(0);
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

    const draw = () => {
      ctx.fillStyle = "rgba(15,23,42,0.15)"; // مشابه bg-slate-950 با کمی شفافیت
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < cols; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, colHeight[i] * fontSize);

        if (colHeight[i] * fontSize > canvas.height && Math.random() > 0.975) {
          colHeight[i] = 0;
        }
        colHeight[i]++;
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = width || window.innerWidth;
      canvas.height = height || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [width, height, columns, fontSize, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
}
