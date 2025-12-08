"use client";

import { useState } from 'react';
import { X, Plus, Trash2, Send, Loader2 } from 'lucide-react';

interface FreeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { telegram: string; questions: string[] }) => void;
  isLoading: boolean;
}

export default function FreeRegisterModal({ isOpen, onClose, onSubmit, isLoading }: FreeRegisterModalProps) {
  const [telegram, setTelegram] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);

  if (!isOpen) return null;

  // مدیریت فیلد سوالات
  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addField = () => setQuestions([...questions, '']);
  
  const removeField = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    if (!telegram.trim()) {
        alert("لطفاً آیدی تلگرام یا شماره همراه خود را وارد کنید.");
        return;
    }
    // ارسال داده‌ها به والد
    onSubmit({ telegram, questions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white transition">
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 text-center">تکمیل ثبت‌نام</h3>

        <div className="space-y-6">
            {/* ورودی تلگرام */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    آیدی تلگرام یا شماره همراه (دارای تلگرام) <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@username یا 0912..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-left"
                    dir="ltr"
                />
            </div>

            {/* ورودی سوالات */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    سوالات شما از مهمان برنامه (اختیاری)
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {questions.map((q, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                placeholder={`سوال ${index + 1}...`}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            />
                            {questions.length > 1 && (
                                <button onClick={() => removeField(index)} className="text-red-400 hover:bg-red-900/20 p-2 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={addField} className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Plus size={16} /> افزودن سوال دیگر
                </button>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : 'نهایی کردن ثبت‌نام'}
            </button>
        </div>
      </div>
    </div>
  );
}