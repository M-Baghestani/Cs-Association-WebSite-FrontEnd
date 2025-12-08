// src/components/EventQuestionForm.tsx
"use client";

import { useState } from 'react';
import { Plus, Trash2, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Props {
    eventId: string;
}

export default function EventQuestionForm({ eventId }: Props) {
    const [questions, setQuestions] = useState<string[]>(['']);
    const [isLoading, setIsLoading] = useState(false);

    // تغییر متن هر سوال
    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    // اضافه کردن فیلد جدید
    const addField = () => {
        setQuestions([...questions, '']);
    };

    // حذف یک فیلد
    const removeField = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    // ارسال فرم
    const handleSubmit = async () => {
        const validQuestions = questions.filter(q => q.trim().length > 0);

        if (validQuestions.length === 0) {
            toast.error("لطفاً حداقل یک سوال بنویسید.");
            return;
        }

        if (!localStorage.getItem('token')) {
            toast.error("برای ارسال سوال باید وارد حساب کاربری شوید.");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // توجه: روت backend برای افزودن سوال باید وجود داشته باشد
            // اگر از همان روت ثبت‌نام استفاده می‌کنید، منطق باید متفاوت باشد
            // اینجا فرض بر این است که یک روت اختصاصی برای افزودن سوال دارید
            await axios.post(`${API_URL}/events/${eventId}/questions`, 
                { questions: validQuestions },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("سوالات شما با موفقیت ثبت شد! 🎉");
            setQuestions(['']); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "خطا در ارسال سوالات.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 mt-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg">❓</span>
                سوالات خود را از مهمان برنامه بپرسید
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                اگر سوال خاصی دارید که دوست دارید در طول رویداد مطرح شود، اینجا بنویسید.
            </p>

            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div key={index} className="flex items-center gap-2 animate-fadeIn">
                        <span className="text-gray-500 font-mono w-6 text-center">{index + 1}.</span>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            placeholder="سوال خود را بنویسید..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition focus:ring-1 focus:ring-blue-500"
                        />
                        
                        {questions.length > 1 && (
                            <button 
                                onClick={() => removeField(index)}
                                className="p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition group"
                                title="حذف"
                            >
                                <Trash2 size={20} className="group-hover:scale-110 transition" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                    onClick={addField}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-dashed border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/5 transition"
                >
                    <Plus size={20} />
                    افزودن سوال جدید
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-700 hover:to-blue-600 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> ارسال سوالات</>}
                </button>
            </div>
        </div>
    );
}