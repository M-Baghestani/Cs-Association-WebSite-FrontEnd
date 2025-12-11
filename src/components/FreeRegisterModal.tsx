"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface FreeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { telegram: string; questions: string[] }) => void;
  isLoading: boolean;
  hasQuestions?: boolean; 
}

export default function FreeRegisterModal({ isOpen, onClose, onSubmit, isLoading, hasQuestions = false }: FreeRegisterModalProps) {
  const [telegram, setTelegram] = useState("");
  // تغییر به یک رشته متنی برای دریافت سوالات تشریحی
  const [userQuestion, setUserQuestion] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // تبدیل متن سوال به آرایه برای ارسال به بک‌اند
    const questionsPayload = hasQuestions && userQuestion.trim() ? [userQuestion] : [];
    
    onSubmit({ 
        telegram, 
        questions: questionsPayload
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
              required 
            />
          </div>

          {/* ✅ بخش سوالات از مهمان */}
          {hasQuestions && (
              <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm font-bold">سوال از مهمان برنامه</span>
                    <span className="text-xs text-gray-500">(اختیاری)</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">اگر سوالی از مهمان دارید، اینجا بنویسید:</label>
                    <textarea 
                      rows={3}
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 resize-none"
                      placeholder="متن سوال خود را وارد کنید..."
                    />
                  </div>
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