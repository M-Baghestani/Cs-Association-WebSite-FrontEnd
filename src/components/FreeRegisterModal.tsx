"use client";

import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // ✅

interface FreeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { telegram: string; questions: string[] }) => void;
  isLoading: boolean;
  hasQuestions?: boolean; 
}

export default function FreeRegisterModal({ isOpen, onClose, onSubmit, isLoading, hasQuestions = false }: FreeRegisterModalProps) {
  const [telegram, setTelegram] = useState("");
  const [questions, setQuestions] = useState<string[]>(['']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addQuestionField = () => setQuestions([...questions, '']);
  const removeQuestionField = (index: number) => setQuestions(questions.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validQuestions = hasQuestions ? questions.filter(q => q.trim().length > 0) : [];
    onSubmit({ telegram, questions: validQuestions });
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] z-10">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50 sticky top-0 z-10">
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

          {hasQuestions && (
              <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm font-bold">سوال از مهمان برنامه</span>
                    <span className="text-xs text-gray-500">(اختیاری)</span>
                  </div>
                  
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                        <div key={index} className="flex gap-2">
                            <input 
                                type="text"
                                value={question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm"
                                placeholder={`سوال ${index + 1}...`}
                            />
                            {questions.length > 1 && (
                                <button 
                                    type="button"
                                    onClick={() => removeQuestionField(index)}
                                    className="p-3 text-red-400 bg-red-900/20 hover:bg-red-900/40 rounded-xl transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addQuestionField} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2">
                        <Plus size={16} /> افزودن سوال دیگر
                    </button>
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
    </div>,
    document.body // ✅ اتصال مستقیم به body
  );
}