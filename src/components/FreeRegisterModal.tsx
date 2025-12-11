"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface FreeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { telegram: string; questions: string[] }) => void;
  isLoading: boolean;
  // ✅ پراپ جدید
  hasQuestions?: boolean; 
}

export default function FreeRegisterModal({ isOpen, onClose, onSubmit, isLoading, hasQuestions = false }: FreeRegisterModalProps) {
  const [telegram, setTelegram] = useState("");
  // سه سوال پیش‌فرض (یا می‌توانید داینامیک کنید)
  const [answers, setAnswers] = useState(["", "", ""]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // اگر سوالات فعال نبود، آرایه خالی بفرست
    onSubmit({ 
        telegram, 
        questions: hasQuestions ? answers : [] 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
          <h3 className="font-bold text-white">تکمیل ثبت‌نام</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">آیدی تلگرام (جهت هماهنگی)</label>
            <input 
              type="text" 
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 ltr-text placeholder:text-gray-600"
              placeholder="@username"
              required // تلگرام همیشه اجباری باشد
            />
          </div>

          {/* ✅ نمایش شرطی سوالات */}
          {hasQuestions && (
              <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                  <p className="text-yellow-400 text-sm font-bold">لطفاً به سوالات زیر پاسخ دهید:</p>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">۱. مقطع و رشته تحصیلی؟</label>
                    <input 
                      required
                      value={answers[0]}
                      onChange={(e) => {
                          const newAns = [...answers];
                          newAns[0] = e.target.value;
                          setAnswers(newAns);
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  {/* می‌توانید سوالات ۲ و ۳ را هم اینجا بگذارید اگر لازم است */}
              </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 transition"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            نهایی کردن ثبت‌نام
          </button>
        </form>
      </div>
    </div>
  );
}