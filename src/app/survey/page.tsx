'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NeuralBackground from '@/components/NeuralBackground'; 

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(true); // برای جلوگیری از پرش صفحه

  // ۱. چک کردن اینکه آیا قبلاً رای داده یا نه
  useEffect(() => {
    const hasVoted = localStorage.getItem('survey_voted');
    if (hasVoted) {
      setSubmitted(true);
    }
    setChecking(false);
  }, []);

  async function handleSubmit(event: any) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    const dataPayload = {
      nocaf_morning: Number(formData.get('nocaf_morning')),
      nocaf_noon: Number(formData.get('nocaf_noon')),
      nocaf_evening: Number(formData.get('nocaf_evening')),
      caf_morning: Number(formData.get('caf_morning')),
      caf_noon: Number(formData.get('caf_noon')),
      caf_evening: Number(formData.get('caf_evening')),
    };

    const { error } = await supabase
      .from('memory_test')
      .insert([dataPayload]);

    setLoading(false);

    if (error) {
      console.error('Supabase Error:', error);
      alert('مشکلی پیش آمد! لطفاً اتصال اینترنت را چک کنید.');
    } else {
      // ۲. ذخیره نشان در مرورگر کاربر
      localStorage.setItem('survey_voted', 'true');
      setSubmitted(true);
    }
  }

  // اگر هنوز داریم چک میکنیم، یک صفحه خالی نشون بده (برای زیبایی)
  if (checking) return <div className="min-h-screen bg-black" />;

  if (submitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden" dir="rtl">
        <div className="absolute inset-0 z-0">
          <NeuralBackground />
        </div>
        
        <div className="relative z-10 bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-green-500/30">
          {/* آیکون قفل یا تیک */}
          <div className="text-6xl mb-4 animate-bounce">🔒</div> 
          <h1 className="text-2xl font-bold text-white mb-2">نظر شما ثبت شده!</h1>
          <p className="text-gray-300 leading-relaxed">
            شما قبلاً در این نظرسنجی شرکت کرده‌اید.
            <br />
            هر دستگاه فقط یک‌بار می‌تواند رای دهد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 z-0">
         <NeuralBackground />
      </div>

      <div className="relative z-10 w-full max-w-xl px-4 py-10">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          
          <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-6 text-white text-center border-b border-white/10">
            <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              آزمون حافظه و تمرکز 🧠
            </h1>
            <p className="text-indigo-200 text-sm opacity-90">
              پروژه آماری: تاثیر کافئین بر عملکرد ذهن
            </p>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="text-sm text-yellow-100 bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30 leading-6 text-center shadow-inner">
                👇 تصور کنید قرار است امتحان حافظه بدهید. نمره خود را (از ۰ تا ۲۰) پیش‌بینی کنید:
              </div>

              {/* بخش اول */}
              <div>
                <h3 className="flex items-center text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                  <span className="ml-2 text-2xl">🚫</span>
                  شرایط اول: بدون کافئین
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <InputCard label="صبح زود" name="nocaf_morning" />
                  <InputCard label="ظهر" name="nocaf_noon" />
                  <InputCard label="عصر" name="nocaf_evening" />
                </div>
              </div>

              {/* بخش دوم */}
              <div>
                <h3 className="flex items-center text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                  <span className="ml-2 text-2xl">☕</span>
                  شرایط دوم: با کافئین
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <InputCard label="صبح زود" name="caf_morning" />
                  <InputCard label="ظهر" name="caf_noon" />
                  <InputCard label="عصر" name="caf_evening" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-95 border border-white/20
                  ${loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25'}
                `}
              >
                {loading ? 'در حال ارسال...' : 'ثبت نهایی'}
              </button>

            </form>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-6 drop-shadow-md">
          انجمن علمی علوم کامپیوتر دانشگاه خوارزمی
        </p>
      </div>
    </div>
  );
}

function InputCard({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex flex-col group">
      <label className="text-xs font-semibold text-gray-300 mb-2 text-center group-hover:text-white transition-colors">{label}</label>
      <input
        required
        type="number"
        name={name}
        min="0"
        max="20"
        placeholder="-"
        className="w-full text-center py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white/10 transition outline-none text-lg font-bold text-white placeholder-gray-500"
      />
    </div>
  );
}