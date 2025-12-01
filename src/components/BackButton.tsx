"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // در صفحه اصلی (Home) دکمه را نشان نده
  if (pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="group fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 p-3 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-blue-600 hover:pr-6 hover:shadow-blue-600/20 active:scale-95"
      title="بازگشت به صفحه قبل"
    >
      <ArrowRight className="h-6 w-6" />
      
      {/* این متن در حالت عادی مخفی است و با هاور ظاهر می‌شود */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100">
        بازگشت
      </span>
    </button>
  );
}